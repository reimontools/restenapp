
import { useState, useEffect} from "react";
import styled from "styled-components";
import { Input, ButtonIcon, Modal, FormUser } from "../../component";
import {db} from "../../config/firebase";
import useModal from "../../hooks/useModal";

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
    .seach-container {
        position: relative;
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
        width: 90%;
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
        padding: 8px;
        text-align: center;        
    };
`;

const User = () => {
    useEffect(() => getUser(), []);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [isOpenModal, openModal, closeModal] = useModal();
    const [preData, setPreData] = useState([]);

    /*CRUD ###########################################################################################*/ 
    const getUser = () => {
        // db.collection('user').onSnapshot((querySnapshot) => {
        //     const users = [];
        //     querySnapshot.forEach((user) => {
        //         users.push({...user.data(), id: user.id})
        //     });
        //     setUsers(users);
        // });
        setUsers([]);
    };

    const delUser = async (id) => {
        await db.collection('user').doc(id).delete();
    };

    const openForm = user => {
        setPreData(user);
        openModal();
    };
    
    /*JSX ############################################################################################*/ 
    return (
        <>
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <FormUser preLoadedData={preData} />
            </Modal>

            <Container className="container">
                <div className="seach-container">
                    <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                    <ButtonIcon.Add action={() => openForm({})}/>
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
                                if(searchTerm === "") {
                                    return val;
                                } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    return val;
                                }
                            }).map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="td-container">
                                            <ButtonIcon.Update action={() => openForm(user)}/>
                                            <ButtonIcon.Delete action={() => delUser(user.id)}/>
                                        </div>
                                    </td>
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