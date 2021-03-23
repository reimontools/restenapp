import { useParams } from 'react-router-dom'
import { useState, useEffect } from "react";
import { getList } from '../../helpers/listHelper';
import { Input, Modal, Button, Select, Table, Container, Icon, Loading, Title } from "../../component";
import useModal from "../../hooks/useModal";
import useList from "../../hooks/useList";
import axios from '../../config/axios'

const GroupAdmin = () => {
    const { prm_group_id } = useParams();
    const [groupInfo, setGroupInfo] = useState({});
    const [groupPlayers, setgroupPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const genders = [{gender: "*", gender_name: "All"}, {gender: "F", gender_name: "Female"}, {gender: "M", gender_name: "Male"}];
    const defaultSearchOptions = {filter_gender: "*", filter_age: "", filter_fullname: ""};
    const [isOpenModal, openModal, closeModal] = useModal();
    const players = useList('player');
    const [searchOptions, setSearchOptions] = useState(defaultSearchOptions);
    const [playerSelected, setPlayerSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasFilter, setHasFilter] = useState(false);

    useEffect(() => {
        fetchGroup(prm_group_id);
        fetchGroupPlayer(prm_group_id);
    }, [prm_group_id]); 

    const openFilter = () => {
        setSearchOptions(defaultSearchOptions);
        setPlayerSelected([]);
        openModal();
    };

    const handleSearchOptions = (e) => {
        setSearchOptions({
            ...searchOptions,
            [e.target.name]: e.target.value
        });
    };

    /*FILTER ############################################################################################*/ 
    function filByGender(player) {
        if(searchOptions.filter_gender === "*") {
            return player;
        } else if (player.gender === searchOptions.filter_gender) {
            return player;
        };
        return null;
    };

    function filByAge(player) {
        if(searchOptions.filter_age === "") {
            return player;
        } else if (player.player_age === parseInt(searchOptions.filter_age)) {
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
    
    const addPlayerSelected = (player) => {
        setPlayerSelected([...playerSelected, player]);
    };

    const removePlayerSelected = (player) => {
        setPlayerSelected(playerSelected.filter(item => item.player_id !== player.player_id));
    };

    /*FETCH ############################################################################################*/ 
    const fetchGroup = async (id) => {
        const res = await getList("group/admin/" + id);
        setGroupInfo(res[0]);
    };

    const fetchGroupPlayer = async (id) => {
        setLoading(true);
        const res = await getList("group-player/" + id);
        setgroupPlayers(res);
        setLoading(false);
    };

    /*CRUD ############################################################################################*/ 
    const addGroupPlayer = async () => {
        try {
            const res = await axios.post("group-player", {group_id: prm_group_id, playerSelected});
            switch(res.data.result[0][0].cod) {
                case 0:
                    // alert('registrado correctamente!');
                    fetchGroupPlayer(prm_group_id);
                    closeModal();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema, error: ' + res.data.result[0][0].msg);
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
                fetchGroupPlayer(prm_group_id);
            };
        } catch (err) {
            console.log(err);
        };
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <Title.Basic2>
                <h2>{groupInfo?.championship_name}</h2>
                <h1>{groupInfo?.name}</h1>
            </Title.Basic2>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <Icon.Basic family="addPerson" action={() => openFilter()} right="12px" hover/>
            </div>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Players</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupPlayers.filter(val => {
                                if(searchTerm === "") {
                                    return val;
                                } else if (val.player_fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    return val;
                                };
                                return null;
                            }).map(groupPlayer => (
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
                    </Table.Primary>
                </Container.Table>
            }
            <Modal.ForForm isOpen={isOpenModal} closeModal={closeModal}>
                
                <Container.Basic>
                    <Title.Basic>
                        Players
                        <Icon.Basic family="search" action={() => setHasFilter(!hasFilter)} hover padding="0 0 0 5px" size="30px" />
                    </Title.Basic>
                    {hasFilter && 
                        <>
                            <Select.Basic name="filter_gender" value={searchOptions.filter_gender} content={genders} action={handleSearchOptions}/>
                            <Input.Basic name="filter_age" value={searchOptions.filter_age} placeholder="All ages" action={handleSearchOptions}/>
                            <Input.Basic name="filter_fullname" value={searchOptions.filter_fullname} action={handleSearchOptions}/>
                        </>
                    }
                    <Container.Label>
                        {playerSelected.map(player => (
                            <div className="item-container" key={player.player_id}>
                                <p>{player.player_fullname}</p>
                                <Icon.Basic family="remove" action={() => removePlayerSelected(player)} />
                            </div>
                        ))}
                        {playerSelected.length > 0 && <Button.Basic family="add" action={() => addGroupPlayer()} fit height="auto" size="11px" margin="0 0 0 15px">Ready</Button.Basic>}
                    </Container.Label>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Add</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.filter(filByGender).filter(filByAge).filter(filByFullName).filter(filBySelected).map(player => (
                                <tr key={player.player_id}> 
                                    <td data-label='Full Name'>{player.player_fullname}</td>
                                    <td data-label='Gender'>{player.gender}</td>
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
        </Container.Primary>
    );
};
export default GroupAdmin;