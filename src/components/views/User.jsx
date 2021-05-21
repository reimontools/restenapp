import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Modal, Button, Select, TableNew, Container, Loading, Title, PlayerSearch, Dialog, PlayerAssigned, Avatar, ButtonFloat, DropDown, IconText } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import useList from '../../hooks/useList';
import { LOWERCASEREGEX, UPPERCASEREGEX, NUMERICREGEX } from "../../helpers/paramHelper";

const User = () => {
    // LIST #########################################################################################################################################
    const playerList = useList('player');
    const rolList = useList("list/rol");

    // CONST ########################################################################################################################################
    const defaultUserData = {user_id: 0, name: '', email: '', rol_id: 3};
    const defaultPasswordData = {password: "", passwordConfirm: ""};

    // EFFECT #######################################################################################################################################
    useEffect(() => fetchUsers(), []);

    // STATE ########################################################################################################################################
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUserId, setCurrentUserId] = useState(0);
    
    // STATE ########################################################################################################################################
    const [loading, setLoading] = useState(true);
    const [dialogOptions, setDialogOptions] = useState({});
    const [userPlayers, setUserPlayers] = useState([]);
    
    // USEMODAL #####################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPassword, openModalPassword, closeModalPassword] = useModal();
    const [isOpenModalPlayerSearch, openModalPlayerSearch, closeModalPlayerSearch] = useModal();
    const [isOpenModalPlayerAssigned, openModalPlayerAssigned, closeModalPlayerAssigned] = useModal();  

    // CRUD VALIDATIONS ############################################################################################################################# 
    const schemaCrud = Yup.object().shape({
        name: Yup.string()
            .required('Required'),
        email: Yup.string()
            .email("Invalid format")
            .required('Required')
    });

    const {register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud} = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // PASSWORD VALIDATIONS #########################################################################################################################
    const schemaPassword = Yup.object().shape({
        password: Yup.string()
            .required('Required!')
            .min(8, "Minimun 8 characters required!")
            .matches(NUMERICREGEX, 'One number required!')
            .matches(LOWERCASEREGEX, 'One lowercase required!')
            .matches(UPPERCASEREGEX, 'One uppercase required!'),
        passwordConfirm: Yup.string()
            .required('Required!')
            .oneOf([Yup.ref('password')], 'Password must be the same!')
    });

    const {register: registerPassword, handleSubmit: handleSubmitPassword, errors: errorsPassword, reset: resetPassword} = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaPassword)
    });

    // FETCHS #######################################################################################################################################
    const fetchUsers = async () => {
        setLoading(true);
        const res = await getList("user");
        setUsers(res);
        setLoading(false);
    };

    const fetchUserPlayer = async user_id => {
        const res = await getList("user-player/" + user_id);
        setUserPlayers(res);
    };

    // CRUD #########################################################################################################################################
    const updateUser = async data => {
        try {
            const res = await axios.post("user", {user_id: currentUserId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchUsers();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateUserPassword = async data => {
        try {
            const res = await axios.post("user/concre", {user_id: currentUserId, ...data});
            if (res.data.result.cod === 0) {
                fetchUsers();
                closeModalPassword();
            } else {
                setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateUserPlayer = async players => {
        try {
            const res = await axios.post("user-player", {user_id: currentUserId, players});
            if (res.data.result.cod !== 0) return setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg});
            fetchUserPlayer(currentUserId);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const updateUserIsActive = async user_id => {
        try {
            const res = await axios.put("user/" + user_id);
            if (!res.data.error) {
                fetchUsers();
            };
        } catch (err) {
            console.log(err);
        };
    };

    const updateUserPlayerIsActive = async player_id => {
        try {
            const res = await axios.put("user-player", {user_id: currentUserId, player_id});
            if (!res.data.error) {
                fetchUserPlayer(currentUserId);
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = user_id => {
        if (user_id === currentUserId) {
            setCurrentUserId(0);
        } else {
            setCurrentUserId(user_id);
        };
    };
    
    const handleModalCrud = (e, user) => {
        e.stopPropagation();
        setCurrentUserId(user.user_id);
        resetCrud(user);
        openModalCrud();
    };

    const handleModalPassword = (e, user) => {
        e.stopPropagation();
        setCurrentUserId(user.user_id);
        resetPassword(defaultPasswordData);
        openModalPassword();
    };

    const handleButtonPlayer = (e, user) => {
        e.stopPropagation();
        setCurrentUserId(user.user_id);
        fetchUserPlayer(user.user_id);
        openModalPlayerAssigned();
    };

    const handleCloseModalPlayerAssigned = () => {
        fetchUsers();
        closeModalPlayerAssigned();
    };

    const handleUpdateUserIsActive = (e, user) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this user?', text: 'Are you sure you want to delete this user?', action: () => updateUserIsActive(user.user_id) });
    };

    // FILTERS ######################################################################################################################################
    function filPlayersByAlreadyOnGroup(player) {
        if(userPlayers.length === 0) {
            return player;
        } else if (!userPlayers.some(value => value.player_id === player.player_id)) {
            return player;
        };
        return null;
    };

    function filUserByText(user) {
        if(searchTerm === "") {
            return user;
        } else if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return user;
        };
        return null;
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

        if (user.user_id === currentUserId) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={user.user_id} onClick={() => handleExpandir(user.user_id)}>
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
            <DropDown.Basic>
                <IconText.Basic family="edit" onClick={e => handleModalCrud(e, user)}>Update</IconText.Basic>
                <IconText.Basic family="delete" onClick={e => handleUpdateUserIsActive(e, user)}>Delete</IconText.Basic>
                <IconText.Basic family="password" onClick={e => handleModalPassword(e, user)}>Password</IconText.Basic>
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
        var text = "", family = "";
        if (user.count_players > 0) {
            text = user.count_players + " Players";
            family = "addPerson";
        } else {
            text = "No Players";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleButtonPlayer(e, user)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    // SX ########################################################################################################################################### 
    return (
        <Container.Primary>

            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
            </div>

            {loading 
                ? <Loading/>
                : <Container.Table>
                    <TableNew.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{users.filter(filUserByText).map(user => renderTableRows(user))}</tbody>
                    </TableNew.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentUserId === 0 ? 'New User' : 'Update User'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={registerCrud} error={errorsCrud.name} />
                    <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={registerCrud} error={errorsCrud.email}/>
                    <Select.Validation name="rol_id" type="select" register={registerCrud} error={errorsCrud.user_type_id} content={rolList} />
                    <Button.Basic onClick={handleSubmitCrud(updateUser)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            
            {/* MODAL PASSWORD ###################################################################################################################### */}
            <Modal.ForForm isOpen={isOpenModalPassword} closeModal={closeModalPassword}>
                <Container.Basic>
                    <Title.Basic>Update password</Title.Basic>
                    <Input.TextValidation name="password" placeholder="Password" type="password" register={registerPassword} error={errorsPassword.password} />
                    <Input.TextValidation name="passwordConfirm" placeholder="Confirm password" type="password" register={registerPassword} error={errorsPassword.passwordConfirm} />
                    <Button.Basic onClick={handleSubmitPassword(updateUserPassword)}>Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>

            {/* PLAYER ASSIGN MODAL ################################################################################################################# */}
            <PlayerAssigned.Basic actionDelete={updateUserPlayerIsActive} actionOpen={openModalPlayerSearch} players={userPlayers} isOpen={isOpenModalPlayerAssigned} close={handleCloseModalPlayerAssigned} /> 
            
            {/* PLAYER SELECTION MODAL ############################################################################################################## */}
            <PlayerSearch action={updateUserPlayer} players={playerList.filter(filPlayersByAlreadyOnGroup)} isOpen={isOpenModalPlayerSearch} close={closeModalPlayerSearch} />
            
            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon hover onClick={e => handleModalCrud(e, defaultUserData)} family="add"/>

        </Container.Primary>
    );
};

export default User;