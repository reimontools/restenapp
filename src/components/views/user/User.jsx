import { useState } from "react";
import {  Button, TableNew, Container, Loading, Dialog, Avatar, ButtonFloat, DropDown } from "../../component.controls";
import { PlayersAssigned, Search } from "../../component.pieces";
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'
import { filterUserNameByText } from "../../../helpers/filter.helper";
import  Concre  from "./Concre";
import  UserCrud  from "./UserCrud";
import { useUser } from "../../../custom-hooks/useUser";
import { useUserPlayer } from "../../../custom-hooks/useUserPlayer";

const User = () => {
    // CUSTOM HOOKS #################################################################################################################################
    const { users, fetchUsers, loading: loadingUsers } = useUser("fetchUsers");
    const { userPlayers, fetchUserPlayersByUserId } = useUserPlayer();

    const [isOpenModalUserCrud, openModalUserCrud, closeModalUserCrud] = useModal();
    const [isOpenModalConcre, openModalConcre, closeModalConcre] = useModal();
    const [isOpenModalPlayerAssigned, openModalPlayerAssigned, closeModalPlayerAssigned] = useModal();  

    // CONST ########################################################################################################################################
    const defaultUserData = {user_id: 0, name: '', email: '', rol_id: ''};

    // STATE ########################################################################################################################################
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD #########################################################################################################################################
    const updateUserPlayer = async players => {
        try {
            const res = await axios.post("user-player", {user_id: currentUser.user_id, players});
            if (res.data.result.cod !== 0) return setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg});
            fetchUserPlayersByUserId(currentUser.user_id);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const updateUserInactive = async user_id => {
        try {
            const res = await axios.put("user/" + user_id);
            if (!res.data.error) {
                fetchUsers();
            };
        } catch (err) {
            console.log(err);
        };
    };

    const updateUserPlayerInactive = async player_id => {
        try {
            const res = await axios.put("user-player", {user_id: currentUser.user_id, player_id});
            if (!res.data.error) {
                fetchUserPlayersByUserId(currentUser.user_id);
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = user => {
        if (user.user_id === currentUser.user_id) {
            setCurrentUser({});
        } else {
            setCurrentUser(user);
        };
    };
    
    const handleModalConcreOpen = (e, user) => {
        e.stopPropagation();
        setCurrentUser(user);
        openModalConcre();
    };

    const handleModalPlayerAssignedOpen = (e, user) => {
        e.stopPropagation();
        setCurrentUser(user);
        fetchUserPlayersByUserId(user.user_id);
        openModalPlayerAssigned();
    };

    const handleModalPlayerAssignedClose = () => {
        fetchUsers();
        closeModalPlayerAssigned();
    };

    const handleUserUpdate = (e, user) => {
        e.stopPropagation();
        setCurrentUser(user);
        openModalUserCrud();
    };

    const handleUserInactive = (e, user) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this user?', text: 'Are you sure you want to delete this user?', action: () => updateUserInactive(user.user_id) });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Players</th>
                <th>Actions</th>
            </tr>
        );
    };

    const renderTableRows = user => {
        var classContent = "";
        var classActions = "";

        if (user.user_id === currentUser.user_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={user.user_id} onClick={() => handleExpandir(user)}>
                <td className="head">
                    {renderAvatar(user)}
                    <div className="dropdown">
                        {renderDropDown(user)}
                    </div>
                </td>
                <td className={classContent} data-label='Email'>{user.email}</td>
                <td className={classContent} data-label='Rol'>{user.rol_name}</td>
                {user.rol_name === "User" 
                    ? <td className={classContent} data-label='Players'>{renderButtonPlayer(user)}</td>
                    : <td className={classContent} />
                }
                <td className={classActions}>{renderActions(user)}</td>
            </tr>  
        );
    };

    const renderAvatar = user => {
        return (
            <div className="avatar-container">
                <Avatar.Letter>{user.name[0]}</Avatar.Letter>
                {user.name}
            </div>
        );
          
    };

    const renderDropDown = user => {
        return (
            <DropDown.Basic family="more">
                <div className="menu-content" onClick={e => handleUserUpdate(e, user)}>Update</div>
                <div className="menu-content" onClick={e => handleUserInactive(e, user)}>Delete</div>
                <div className="menu-content" onClick={e => handleModalConcreOpen(e, user)}>Password</div>
            </DropDown.Basic>
        );
    };

    const renderActions = user => {
        return (
            <div className="td-container">
               {renderDropDown(user)}
            </div>
        );
    };
    
    const renderButtonPlayer = user => {
        const text = user.count_players > 0 ? user.count_players + " Players" : "No Players";
        const family = user.count_players > 0 ? "addPerson" : "remove";
        return <Button.Basic family={family} onClick={e => handleModalPlayerAssignedOpen(e, user)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    // JSX ##########################################################################################################################################
    return (
        <>
            <Container.Primary>
                <Search value={searchTerm} action={setSearchTerm} />
                {loadingUsers 
                    ? <Loading/>
                    : <Container.Table>
                        <TableNew.Basic>
                            <thead>{renderTableHead()}</thead>
                            <tbody>{users.filter(filterUserNameByText(searchTerm)).map(user => renderTableRows(user))}</tbody>
                        </TableNew.Basic>
                    </Container.Table>
                }
            </Container.Primary>

            {/* CRUD USER ########################################################################################################################### */}
            <UserCrud fetch={fetchUsers} user={currentUser} isOpen={isOpenModalUserCrud} close={closeModalUserCrud} />

            {/* CRUD CONCRE ######################################################################################################################### */}
            <Concre user={currentUser} isOpen={isOpenModalConcre} close={closeModalConcre} />

            {/* PLAYER ASSIGN MODAL ################################################################################################################# */}
            <PlayersAssigned actionRemove={updateUserPlayerInactive} actionAdd={updateUserPlayer} playersAssigned={userPlayers} isOpen={isOpenModalPlayerAssigned} close={handleModalPlayerAssignedClose} isSearchable={true} isRemovable={true} /> 
            
            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUserUpdate(e, defaultUserData)} hover family="newFloat"/>

        </>
    );
};

export default User;