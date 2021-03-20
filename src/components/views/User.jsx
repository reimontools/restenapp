import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, ButtonIcon, Modal, Button, Card, Select, Table, Container } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import useList from '../../hooks/useList';
import moment from 'moment';

const User = () => {
    useEffect(() => fetchUsers(), []);
    const [users, setUsers] = useState([]);
    const userTypes = useList("list/user-type");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentID, setCurrentID] = useState(0);
    const [isOpenModal, openModal, closeModal] = useModal();
    const defaultData = {user_id: 0, name: '', surname: '', gender: 'F',  email: '', birth_date: '', user_type_id: '3'};
    const genders = [{gender: "F", gender_name: "Female"}, {gender: "M", gender_name: "Male"}];

    console.log(users);

    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        surname: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        email: Yup.string().email("Invalid format"),
        birth_date: Yup
            .date()
            .nullable()
            .transform((curr, orig) => orig === '' ? null : curr)
            .max(moment().subtract(2, 'years').calendar(), "Too young")
            .min(moment().subtract(70, 'years').calendar(), "Too old")
            .required('Required')
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
        const users = await getList("user");
        setUsers(users);
    };

    const addUser = async data => {
        console.log('Antes de guardar', {user_id: currentID, ...data});
        try {
            const res = await axios.post("user", {user_id: currentID, ...data});
            switch(res.data.result[0][0].cod) {
                case 0:
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
            const res = await axios.put("user/" + user_id);
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
        <Container.Primary>
            
            <Modal.ForForm isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title="User">
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.TextValidation name="surname" placeholder="Surname" register={register} error={errors.surname} />
                    <Select.TextValidation name="gender" type="select" register={register} error={errors.user_type_id} content={genders} />
                    <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={register} error={errors.email}/>
                    <Input.DateValidation name="birth_date" register={register} error={errors.birth_date}/>
                    <Select.TextValidation name="user_type_id" type="select" register={register} error={errors.user_type_id} content={userTypes} />
                    <Button.Primary action={handleSubmit(addUser)}>Save</Button.Primary>   
                </Card.Primary>
            </Modal.ForForm>

            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <ButtonIcon.Add action={() => openForm(defaultData)}/>
            </div>

            <Table.Primary>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Rol</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter(val => {
                        if(searchTerm === "") {
                            return val;
                        } else if (val.user_fullname.toLowerCase().includes(searchTerm.toLowerCase()) || val.user_type_name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return val;
                        };
                        return null;
                    }).map(user => (
                        <tr key={user.user_id}>
                            <td data-label='Name'>{user.name}</td>
                            <td data-label='Surname'>{user.surname}</td>
                            <td data-label='Rol'>{user.user_type_name}</td>
                            <td data-label='Age'>{user.user_age}</td>
                            <td data-label='Actions'>
                                <div className="td-container">
                                    <ButtonIcon.Update action={() => openForm(user)} />
                                    <ButtonIcon.Delete action={() => staUser(user.user_id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table.Primary>
        </Container.Primary>
    );
};

export default User;