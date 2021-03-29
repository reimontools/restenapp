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
    const [groupPlayers, setGroupPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const genderList = [{gender_id: "*", name: "Filter by gender..."}, ...useList("list/gender")];
    const defaultSearchOptions = {filter_gender: "*", filter_age: "", filter_fullname: ""};
    const [isOpenModal, openModal, closeModal] = useModal();
    const [searchOptions, setSearchOptions] = useState(defaultSearchOptions);
    const [playerSelected, setPlayerSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasFilter, setHasFilter] = useState(false);

    useEffect(() => {
        fetchGroup(prm_group_id);
        fetchGroupPlayer(prm_group_id);
    }, [prm_group_id]); 
    
    const handleSearchOptions = (e) => {
        setSearchOptions({
            ...searchOptions,
            [e.target.name]: e.target.value
        });
    };
    
    /*FILTER ############################################################################################*/ 
    const playerList = useList('player');
    const playerListFiltered = playerList.filter(filByGender).filter(filByAge).filter(filByFullName).filter(filBySelected).filter(filByAlreadyOnGroup);
    
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
    
    const openFilter = () => {
        setSearchOptions(defaultSearchOptions);
        setPlayerSelected([]);
        setHasFilter(false);
        openModal();
    };

    /*FETCH ############################################################################################*/ 
    const fetchGroup = async (id) => {
        const res = await getList("group/admin/" + id);
        setGroupInfo(res[0]);
    };

    const fetchGroupPlayer = async (id) => {
        setLoading(true);
        const res = await getList("group-player/" + id);
        setGroupPlayers(res);
        setLoading(false);
    };

    /*CRUD ############################################################################################*/ 
    const addGroupPlayer = async () => {
        try {
            const res = await axios.post("group-player", {group_id: prm_group_id, playerSelected});
            switch(res.data.result.cod) {
                case 0:
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
                        Add players
                        <Icon.Basic family="search" action={() => setHasFilter(!hasFilter)} hover padding="0 0 0 10px" size="30px" />
                    </Title.Basic>
                    {hasFilter && 
                        <>
                            <Select.Basic name="filter_gender" value={searchOptions.filter_gender} content={genderList} action={handleSearchOptions}/>
                            <Input.Basic name="filter_age" value={searchOptions.filter_age} placeholder="Filter by age..." action={handleSearchOptions}/>
                            <Input.Basic name="filter_fullname" value={searchOptions.filter_fullname} placeholder="Filter by name" action={handleSearchOptions}/>
                        </>
                    }
                    <Container.Label>
                        {playerSelected.map(player => (
                            <div className="item-container" key={player.player_id}>
                                <p>{player.player_fullname}</p>
                                <Icon.Basic family="remove" action={() => removePlayerSelected(player)} />
                            </div>
                        ))}
                        {playerSelected.length > 0 && <Button.Basic family="search" action={() => addGroupPlayer()} fit height="auto" weight="100" size="11px" margin="0 0 0 15px">add {playerSelected.length} player(s)</Button.Basic>}
                    </Container.Label>
                    <Table.Primary>
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
        </Container.Primary>
    );
};
export default GroupAdmin;