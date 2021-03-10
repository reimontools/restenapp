
import { useState, useEffect } from "react";
import { Form, Input, Button, ButtonIcon } from "../../component";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import {db} from "../../config/firebase";

import styled from "styled-components";

const Container = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%;

    .table-container {
        width: 90%;
    };

    .td-container {
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
    };

    table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 10px;
    };

    thead {
        background: #0e70b8;
    };

    thead tr th {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.35px;
        color: #FFFFFF;
        padding: 12px;
        vertical-align: top;
    };

    tbody tr td {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.35px;
        /* color: #FFFFFF; */
        padding: 8px;
        /* vertical-align: top; */
        text-align: center;        
    };

    .especial {
        position: relative;
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
        width: 90%;
    }
`;

const User = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    useEffect(() => getUser(), []);

    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        surname: Yup.string().required('Required'),
        email: Yup.string().email("Invalid format").required('Required')
    });
    const { register, handleSubmit, errors } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    /*CRUD ###########################################################################################*/ 
    const onSubmit = data => {
        console.log(data);
        setUser(data);
    };

    const setUser = async (dataObject) => {
        await db.collection('user').doc().set(dataObject);
    };

    const getUser = () => {
        db.collection('user').onSnapshot((querySnapshot) => {
            const users = [];
            querySnapshot.forEach((user) => {
                users.push({...user.data(), id: user.id})
            });
            setUsers(users);
        });
    };

    const delUser = async (id) => {
        await db.collection('user').doc(id).delete();
    };
    
    /*JSX ############################################################################################*/ 
    return (
        <>
            <Container className="container">

                {/* <Form.StyleOne title="User">
                    <Input.TextValidation name="name" label="Name" placeholder="Jennifer" register={register} error={errors.name} />
                    <Input.TextValidation name="surname" label="Surname" placeholder="Connor" register={register} error={errors.surname} />
                    <Input.TextValidation name="email" label="Email" type="email" placeholder="jennifer.connor@gmail.com" register={register} error={errors.email}/>
                    <Button.StyledOne action={handleSubmit(onSubmit)}>Save</Button.StyledOne>   
                </Form.StyleOne> */}

                <div className="especial">
                    <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                    <ButtonIcon.Add />
                </div>
                
                
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(val => {
                                if(searchTerm == "") {
                                    return val;
                                } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    return val;
                                }
                            }).map(e => (
                                <tr key={e.id}>
                                    <td>{e.name}</td>
                                    <td>{e.surname}</td>
                                    <td>{e.email}</td>
                                    <td>
                                        <div className="td-container">
                                            <ButtonIcon.Update />
                                            <ButtonIcon.Delete action={() => delUser(e.id)}/>
                                            {/* <ButtonIcon.Add /> */}
                                        </div>
                                    </td>
                                    
                                    {/* <td><Button color="primary" onClick={() => showModalAppointmentToCreate(e_person)}>Nuevo</Button></td>
                                    <td><Button onClick={() => showModalAppointments(e_person)}>Listado</Button></td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </>
    );
};

export default User;