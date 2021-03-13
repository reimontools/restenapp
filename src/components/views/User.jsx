
import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Input, ButtonIcon, Modal, Button, Card } from "../../component";
import {db} from "../../config/firebase";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const TableContainer = styled.div `
    width: 90%;
    .td-container {
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
    };
    table {
        width: 100%;
        border-collapse: collapse;
        /* border-radius: 10px; */
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
    thead tr th:first-child {
        border-radius: 3px 0 0 0
    };
    thead tr th:last-child {
        border-radius: 0 3px 0 0
    };
    tbody tr td {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.35px;
        padding: 8px;
        text-align: center;        
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        color: #222;
        table {
            border-radius: 10px;
        };
        thead {
            display: none;
        };
        tbody, tr, td  {
            display: block;
            width: 100%;
        };
        tbody tr {
            margin-bottom: 15px;
            /* border: 3px solid #0e70b8;  */
            /* border-radius: 30px; */
        };
        tbody tr td {
            text-align: right;
            padding-left: 30%;
            position: relative;
            background-color: #d1ebf7;
        };
        tbody tr td:first-child {
            border-radius: 3px 3px 0 0
        };
        tbody tr td:last-child {
            border-radius: 0 0 3px 3px
        };
        tbody td:before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 30%;
            padding-left: 8px;
            font-weight: 600;
            font-size: 14px;
            text-align: left;
        };
        .td-container {
            padding-left: 65%;
            justify-content: space-between;
        };
    };
`;

const Container = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%;
    .search-container {
        position: relative;
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
        width: 90%;
    };
`;

const User = () => {
    useEffect(() => getUser(), []);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [isOpenModal, openModal, closeModal] = useModal();
    const defaultData = {id: '', name: '', surname: '', email: ''};
    const [currentId, setCurrentID] = useState('');

    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        surname: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        email: Yup.string().email("Invalid format").required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const openForm = user => {
        setCurrentID(user.id);
        reset(user);
        openModal();
    };

    const onSubmit = data => {
        setUser(data);
    };

    /*CRUD ###########################################################################################*/ 
    const getUser = () => {
        try {
            db.collection('user').onSnapshot((querySnapshot) => {
                const users = [];
                querySnapshot.forEach((user) => {
                    users.push({...user.data(), id: user.id})
                });
                setUsers(users);
            });
        } catch (err) {
            console.log(err);
        };
    };

    const setUser = async (data) => {
        try {
            if (currentId === '') {
                await db.collection('user').doc().set(data);
            } else {
                await db.collection('user').doc(currentId).update(data);
                setCurrentID('');
            };
            closeModal();
        } catch (err) {
            console.log(err);
        };
    };
    
    const delUser = async (id) => {
        try {
            await db.collection('user').doc(id).delete();
        } catch (err) {
            console.log(err);
        };
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container>
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title="User">
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.TextValidation name="surname" placeholder="Surname" register={register} error={errors.surname} />
                    <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={register} error={errors.email}/>
                    <Button.Primary action={handleSubmit(onSubmit)}>Save</Button.Primary>   
                </Card.Primary>
            </Modal>

            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <ButtonIcon.Add action={() => openForm(defaultData)}/>
            </div>

            <TableContainer>
                <table>
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
                            if(searchTerm === "") {
                                return val;
                            } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase()) || val.surname.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return val;
                            }
                        }).map(user => (
                            <tr key={user.id}>
                                <td data-label='Name'>{user.name}</td>
                                <td data-label='Surname'>{user.surname}</td>
                                <td data-label='Email'>{user.email}</td>
                                <td data-label='Actions'>
                                    <div className="td-container">
                                        <ButtonIcon.Update action={() => openForm(user)} />
                                        <ButtonIcon.Delete action={() => delUser(user.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableContainer>
        </Container>
    );
};

export default User;