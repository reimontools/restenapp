import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Icon, Modal, Button, Select, Table, Container, Loading, Title, Dialog } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios';
import useList from '../../hooks/useList';
import { useHistory, useParams } from 'react-router-dom';

const Seed = () => {
    const { prm_championship_id } = useParams();
    const history = useHistory();
    const [groups, setGroups] = useState([]);
    const [currentGroupId, setCurrentGroupId] = useState(0);
    // const defaultData = {group_id: 0, name: ''};

    useEffect(() => {
        fetchGroups(prm_championship_id);
    }, [prm_championship_id]); 

    const goGroupPlayer = id => {
        history.push('/match/' + id);
    };

    const [loading, setLoading] = useState(true);
    const [groupPlayers, setGroupPlayers] = useState([]);
    const defaultSearchOptions = {filter_gender: "", filter_age: "", filter_fullname: ""};
    const [searchOptions, setSearchOptions] = useState(defaultSearchOptions);
    const [hasFilter, setHasFilter] = useState(false);
    const genderList = useList("list/gender");
    const [playerSelected, setPlayerSelected] = useState([]);
    const playerList = useList('player');
    const playerListFiltered = playerList.filter(filByGender).filter(filByAge).filter(filByFullName).filter(filBySelected).filter(filByAlreadyOnGroup);
    
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPlayer, openModalPlayer, closeModalPlayer] = useModal();
    const [isOpenModalAssign, openModalAssign, closeModalAssign] = useModal();

    const [dialogOptions, setDialogOptions] = useState({});
    // const [searchTerm, setSearchTerm] = useState("");
    
    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const showModalCrud = group => {
        setCurrentGroupId(group.group_id);
        fetchGroupPlayer(group.group_id);
        reset(group);
        openModalCrud();
    };

    const showModalAssign = group => {
        setCurrentGroupId(group.group_id);
        fetchGroupPlayer(group.group_id);
        openModalAssign();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchGroups = async id => {
        setLoading(true);
        const res = await getList("group/" + id);
        setGroups(res);
        setLoading(false);
    };

    const addGroup = async data => {
        try {
            const res = await axios.post("group", {group_id: currentGroupId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchGroups(prm_championship_id);
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
    
    // const staGroup = async (id) => {
    //     try {
    //         const res = await axios.put("group/" + id);
    //         if (!res.data.error) {
    //             fetchGroups(prm_championship_id);
    //         };
    //     } catch (err) {
    //         console.log(err);
    //     };
    // };
    
    /*PLAYER #########################################################################################*/ 
    function filByGender(player) {
        if(searchOptions.filter_gender === "") {
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
        if(groupPlayers.length === 0) {
            return player;
        } else if (!groupPlayers.some(value => value.player_id === player.player_id)) {
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

    const fetchGroupPlayer = async (id) => {
        const res = await getList("group-player/" + id);
        setGroupPlayers(res);
    };

    const handleSearchOptions = (e) => {
        setSearchOptions({
            ...searchOptions,
            [e.target.name]: e.target.value
        });
    };

    const addGroupPlayer = async () => {
        try {
            const res = await axios.post("group-player", {group_id: currentGroupId, playerSelected});
            switch(res.data.result.cod) {
                case 0:
                    fetchGroupPlayer(currentGroupId);
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

    const staGroupPlayer = async (id) => {
        try {
            const res = await axios.put("group-player/" + id);
            if (!res.data.error) {
                fetchGroupPlayer(currentGroupId);
            };
        } catch (err) {
            console.log(err);
        };
    };

    const renderBtnPlayers = group => {
        var text = "", family = "";
        if (group.count_players > 0) {
            text = group.count_players + " Players";
            family = "addPerson";
        } else {
            text = "No Players";
            family = "remove";
        };
        return <Button.Basic family={family} action={() => showModalAssign(group)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const beforeCloseModalAssing = () => {
        fetchGroups(prm_championship_id);
        closeModalAssign();
    };

    const renderActions = obj => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    action={() => showModalCrud(obj)}
                    family="edit"
                    hover
                />
                {/* <Icon.Basic 
                    action={() => setDialogOptions({
                        family: "delete",
                        title: 'Delete this group?', 
                        text : 'Are you sure you want to delete this group?', 
                        action: () => staGroup(obj.group_id)})} 
                    family="delete" 
                    hover
                /> */}
            </div>
        );
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <Title.Basic fontSize="20px">{groups[0]?.championship_name}</Title.Basic> 
            <Title.Basic>{groups[0]?.championship_type_name}</Title.Basic>
            {/* <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <Icon.Basic family="add" action={() => showModalCrud(defaultData)} right="12px" hover/>
            </div> */}
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Phase</th>
                                <th>Players</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map(group => (
                                <tr key={group.group_id} onClick={() => goGroupPlayer(group.group_id)}>
                                    <td data-label='Group'>{group.name}</td>
                                    <td data-label=''>{renderBtnPlayers(group)}</td>
                                    <td data-label='Actions'>{renderActions(group)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Container.Table>
            }
            {/* MODAL CRUD ################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentGroupId === 0 ? 'New Group' : 'Update Group'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Button.Basic action={handleSubmit(addGroup)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            {/* MODAL ASSIGN ################################################################################################ */}
            <Modal.ForForm isOpen={isOpenModalAssign} closeModal={beforeCloseModalAssing}>
                <Container.Basic>
                    <Title.Basic>
                        Assigned players
                        <Icon.Basic family="search" action={() => openPlayerFilter()} hover size="30px" left="10px" top="10px"/>
                    </Title.Basic>
                    {groupPlayers.length > 0 &&<Table.Primary margin="10px 0 0 0">
                        <thead>
                            <tr>
                                <th>Players</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupPlayers.map(groupPlayer => (
                                <tr key={groupPlayer.group_player_id}>
                                    <td data-label='Player'>{groupPlayer.player_fullname}</td>
                                    <td data-label=''>
                                        <div className="td-container">
                                            <Icon.Basic family="delete" action={() => staGroupPlayer(groupPlayer.group_player_id)} hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>}
                </Container.Basic>
            </Modal.ForForm>    
            {/* MODAL FILTER PLAYER ######################################################################################### */}
            <Modal.ForForm isOpen={isOpenModalPlayer} closeModal={closeModalPlayer}>
                <Container.Basic>
                    <Title.Basic>Select players
                        <Icon.Basic family="filter" action={() => setHasFilter(!hasFilter)} hover size="30px" left="10px" top="10px" />
                    </Title.Basic>
                    {hasFilter && 
                        <>
                            <Select.Filter name="filter_gender" text="All the guys" value={searchOptions.filter_gender} content={genderList} action={handleSearchOptions}/>
                            <Input.Basic name="filter_age" value={searchOptions.filter_age} placeholder="Filter by age..." action={handleSearchOptions}/>
                            <Input.Basic name="filter_fullname" value={searchOptions.filter_fullname} placeholder="Filter by name" action={handleSearchOptions}/>
                        </>
                    }
                    {playerSelected.length > 0 && 
                        <Container.Label>
                            {playerSelected.map(player => (
                                <div className="item-container" key={player.player_id}>
                                    <p>{player.player_fullname}</p>
                                    <Icon.Basic family="remove" action={() => removePlayerSelected(player)} />
                                </div>
                            ))}
                            {playerSelected.length > 0 && <Button.Basic family="search" action={() => addGroupPlayer()} fit height="auto" weight="100" size="11px" margin="0 0 0 15px">assign {playerSelected.length} player(s)</Button.Basic>}
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
                                    <Icon.Basic family="dobleCheck" action={() => addAllPlayer()} hover/>
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
                                            <Icon.Basic family="check" action={() => addPlayerSelected(player)} hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Container.Basic>
            </Modal.ForForm>    
            {/* DIALOG  ##################################################################################################### */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Primary>
    );
};

export default Seed;