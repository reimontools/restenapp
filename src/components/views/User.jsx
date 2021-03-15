
import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Input, ButtonIcon, Modal, Button, Card, Select } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";
import { getList } from '../../helpers/listHelper'; 
import axios from "axios";
import useList from '../../hooks/useList';

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
    useEffect(() => fetchUsers(), []);
    const [users, setUsers] = useState([]);
    const userTypes = useList("list/user-type");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentID, setCurrentID] = useState(0);
    const [isOpenModal, openModal, closeModal] = useModal();
    const defaultData = {user_id: 0, name: '', surname: '', email: '', birth_date: '', user_type_id: '1'};

    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        surname: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        email: Yup.string().email("Invalid format").required('Required'),
        birth_date: Yup.string().required('Required'),
        user_type_id: Yup.string().required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const openForm = user => {
        setCurrentID(user.user_id);
        reset(user);
        openModal();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchUsers = async () => {
        const users = await getList("/user");
        setUsers(users);
    };

    const addUser = async data => {
        // console.log('Antes de guardar', {user_id: currentID, ...data});
        try {
            const res = await axios.post('https://rfsoftdev.xyz' + "user", {user_id: currentID, ...data});
            switch(res.data.result[0][0].cod) {
                case 0:
                    alert('registrado correctamente!');
                    fetchUsers();
                    closeModal();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema, error: ' + + res.data.result[0][0].msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const staUser = async (user_id) => {
        try {
            const res = await axios.put('https://rfsoftdev.xyz' + "user/" + user_id);
            if (!res.data.error) {
                alert('Inactivado!');
                fetchUsers();
            };
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
                    <Input.TextValidation name="birth_date" placeholder="2013/07/15" register={register} error={errors.birth_date}/>
                    <Select.TextValidation name="user_type_id" type="select" register={register} error={errors.user_type_id} content={userTypes} />
                    <Button.Primary action={handleSubmit(addUser)}>Save</Button.Primary>   
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
                            <th>Rol</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(val => {
                            if(searchTerm === "") {
                                return val;
                            } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase()) || val.surname.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return val;
                            };
                            return null;
                        }).map(user => (
                            <tr key={user.user_id}>
                                <td data-label='Name'>{user.name}</td>
                                <td data-label='Surname'>{user.surname}</td>
                                <td data-label='Rol'>{user.user_type_name}</td>
                                <td data-label='Actions'>
                                    <div className="td-container">
                                        <ButtonIcon.Update action={() => openForm(user)} />
                                        <ButtonIcon.Delete action={() => staUser(user.user_id)} />
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