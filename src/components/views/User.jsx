import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Icon, Modal, Button, Select, Table, Container, Loading, Title } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import useList from '../../hooks/useList';

const User = () => {
    useEffect(() => fetchUsers(), []);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUserId, setCurrentUserId] = useState(0);
    const defaultData = {user_id: 0, name: '', email: '', rol_id: 3};
    const [loading, setLoading] = useState(true);
    const rols = useList("list/rol");

    const [userPlayers, setUserPlayers] = useState([]);
    const defaultSearchOptions = {filter_gender: "*", filter_age: "", filter_fullname: ""};
    const [searchOptions, setSearchOptions] = useState(defaultSearchOptions);
    const [hasFilter, setHasFilter] = useState(false);
    const genderList = [{gender_id: "*", name: "Filter by gender..."}, ...useList("list/gender")];
    const [playerSelected, setPlayerSelected] = useState([]);
    const playerList = useList('player');
    const playerListFiltered = playerList.filter(filByGender).filter(filByAge).filter(filByFullName).filter(filBySelected).filter(filByAlreadyOnGroup);
    
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPlayer, openModalPlayer, closeModalPlayer] = useModal();
    const [isOpenModalAssign, openModalAssign, closeModalAssign] = useModal();
    
    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email("Invalid format").required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const showModalCrud = user => {
        setCurrentUserId(user.user_id);
        fetchUserPlayer(user.user_id);
        reset(user);
        openModalCrud();
    };

    const showModalAssign = user => {
        setCurrentUserId(user.user_id);
        fetchUserPlayer(user.user_id);
        openModalAssign();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchUsers = async () => {
        setLoading(true);
        const res = await getList("user");
        setUsers(res);
        setLoading(false);
    };

    const addUser = async data => {
        try {
            const res = await axios.post("user", {user_id: currentUserId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchUsers();
                    closeModalCrud();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema!, error: ' + res.data.result.msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const staUser = async (id) => {
        try {
            const res = await axios.put("user/" + id);
            if (!res.data.error) {
                fetchUsers();
            };
        } catch (err) {
            console.log(err);
        };
    };

    function filUser(user) {
        if(searchTerm === "") {
            return user;
        } else if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return user;
        };
        return null;
    };
    
    /*PLAYER #########################################################################################*/ 
    function filByGender(player) {
        if(searchOptions.filter_gender === "*") {
            return player;
        } else if (player.gender_id === parseInt(searchOptions.filter_gender)) {
            return player;
        };
        return null;
    };

    function filByAge(player) {
        const ages = searchOptions.filter_age.split(',').map(Number);
        if(searchOptions.filter_age === "") {
            return player;
        } else if (ages.includes(player.player_age)) {
            return player;
        };
        return null;
    };

    function filByFullName(player) {
        if(searchOptions.filter_fullname === "") {
            return player;
        } else if (player.player_fullname.toLowerCase().includes(searchOptions.filter_fullname.toLowerCase())) {
            return player;
        };
        return null;
    };

    function filBySelected(player) {
        if(playerSelected.length === 0) {
            return player;
        } else if (!playerSelected.includes(player)) {
            return player;
        };
        return null;
    };  
    
    function filByAlreadyOnGroup(player) {
        if(userPlayers.length === 0) {
            return player;
        } else if (!userPlayers.some(value => value.player_id === player.player_id)) {
            return player;
        };
        return null;
    };

    const addAllPlayer = () => {
        setPlayerSelected([...playerSelected, ...playerListFiltered]);
    };
    
    const addPlayerSelected = (player) => {
        setPlayerSelected([...playerSelected, player]);
    };

    const removePlayerSelected = (player) => {
        setPlayerSelected(playerSelected.filter(item => item.player_id !== player.player_id));
    };

    const openPlayerFilter = () => {
        setSearchOptions(defaultSearchOptions);
        setPlayerSelected([]);
        setHasFilter(false);
        openModalPlayer();
    };

    const fetchUserPlayer = async (id) => {
        const res = await getList("user-player/" + id);
        setUserPlayers(res);
    };

    const handleSearchOptions = (e) => {
        setSearchOptions({
            ...searchOptions,
            [e.target.name]: e.target.value
        });
    };

    const addUserPlayer = async () => {
        try {
            const res = await axios.post("user-player", {user_id: currentUserId, playerSelected});
            switch(res.data.result.cod) {
                case 0:
                    fetchUserPlayer(currentUserId);
                    closeModalPlayer();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema!, error: ' + res.data.result.msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const staUserPlayer = async (id) => {
        try {
            const res = await axios.put("user-player/" + id);
            if (!res.data.error) {
                fetchUserPlayer(currentUserId);
            };
        } catch (err) {
            console.log(err);
        };
    };

    const renderBtnPlayers = (user) => {
        var text = "", family = "";
        if (user.count_players > 0) {
            text = user.count_players + " Players";
            family = "addPerson";
        } else {
            text = "No Players";
            family = "remove";
        };
        if (user.rol_name === "User") return <Button.Basic family={family} onClick={() => showModalAssign(user)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
        return null;
    };

    const beforeCloseModalAssing = () => {
        fetchUsers();
        closeModalAssign();
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <Icon.Basic family="add" onClick={() => showModalCrud(defaultData)} right="12px" hover/>
            </div>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Players</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(filUser).map(user => (
                                <tr key={user.user_id}>
                                    <td data-label='Name'>{user.name}</td>
                                    <td data-label='Email'>{user.email}</td>
                                    <td data-label='Rol'>{user.rol_name}</td>
                                    <td data-label=''>
                                        {renderBtnPlayers(user)}
                                    </td>
                                    <td data-label='Actions'>
                                        <div className="td-container">
                                            <Icon.Basic family="edit" onClick={() => showModalCrud(user)} hover/>
                                            <Icon.Basic family="delete" onClick={() => staUser(user.user_id)} hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Container.Table>
            }

            {/* MODAL CRUD ################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentUserId === 0 ? 'New User' : 'Update User'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={register} error={errors.email}/>
                    <Select.Validation name="rol_id" type="select" register={register} error={errors.user_type_id} content={rols} />
                    <Input.TextValidation name="password" type="password" placeholder="Write a password" register={register} />
                    <Button.Basic onClick={handleSubmit(addUser)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            
            {/* MODAL ASSIGN ################################################################################################ */}
            <Modal.ForForm isOpen={isOpenModalAssign} closeModal={beforeCloseModalAssing}>
                <Container.Basic>
                    <Title.Basic>
                        Assigned players
                        <Icon.Basic family="search" onClick={() => openPlayerFilter()} hover size="30px" left="10px" top="10px"/>
                    </Title.Basic>
                    {userPlayers.length > 0 &&<Table.Primary margin="10px 0 0 0">
                        <thead>
                            <tr>
                                <th>Players</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPlayers.map(userPlayer => (
                                <tr key={userPlayer.user_player_id}>
                                    <td data-label='Player'>{userPlayer.player_fullname}</td>
                                    <td data-label=''>
                                        <div className="td-container">
                                            <Icon.Basic family="delete" onClick={() => staUserPlayer(userPlayer.user_player_id)} hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>}
                </Container.Basic>
            </Modal.ForForm>
            
            {/* MODAL PLAYER ################################################################################################ */}
            <Modal.ForForm isOpen={isOpenModalPlayer} closeModal={closeModalPlayer}>
                <Container.Basic>
                    <Title.Basic>Select players
                        <Icon.Basic family="filter" onClick={() => setHasFilter(!hasFilter)} hover size="30px" left="10px" top="10px" />
                    </Title.Basic>
                    {hasFilter && 
                        <>
                            <Select.Basic name="filter_gender" value={searchOptions.filter_gender} content={genderList} action={handleSearchOptions}/>
                            <Input.Basic name="filter_age" value={searchOptions.filter_age} placeholder="Filter by age..." action={handleSearchOptions}/>
                            <Input.Basic name="filter_fullname" value={searchOptions.filter_fullname} placeholder="Filter by name" action={handleSearchOptions}/>
                        </>
                    }
                    {playerSelected.length > 0 && 
                        <Container.Label>
                            {playerSelected.map(player => (
                                <div className="item-container" key={player.player_id}>
                                    <p>{player.player_fullname}</p>
                                    <Icon.Basic family="remove" onClick={() => removePlayerSelected(player)} />
                                </div>
                            ))}
                            {playerSelected.length > 0 && <Button.Basic family="search" onClick={() => addUserPlayer()} fit height="auto" weight="100" size="11px" margin="0 0 0 15px">assign {playerSelected.length} player(s)</Button.Basic>}
                        </Container.Label>
                    }
                    <Table.Primary margin="10px 0 0 0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>
                                    <div className="td-container">
                                    <Icon.Basic family="dobleCheck" onClick={() => addAllPlayer()} hover/>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerListFiltered.map(player => (
                                <tr key={player.player_id}> 
                                    <td data-label='Name'>{player.player_fullname}</td>
                                    <td data-label='Gender'>{player.gender_name}</td>
                                    <td data-label='Age'>{player.player_age}</td>
                                    <td>
                                        <div className="td-container">
                                            <Icon.Basic family="check" onClick={() => addPlayerSelected(player)} hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Container.Basic>
            </Modal.ForForm>
        </Container.Primary>
    );
};

export default User;