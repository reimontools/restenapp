import { useState, useEffect, useContext} from "react";
import { AppContext } from "../../store/AppProvider";
import { getList } from '../../helpers/listHelper';
import styled from "styled-components";
import { Input, Modal, Button, Card, Select, Table, Container, Icon } from "../../component";
import useModal from "../../hooks/useModal";
import useList from "../../hooks/useList";

const DivTitle = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
`;

const DivSelected = styled.div `
    display: flex;
    flex-wrap: wrap;
    height: auto;
    font-size: 11px;
    margin: 10px 0 10px 0;
    .item-container {
        width: auto;
        display: flex;
        align-items: center;
        border-radius: 5px;
        padding: 2px;
    }
`;

const GroupAdmin = () => {
    const { globalGroupId } = useContext(AppContext);
    const [groupInfo, setGroupInfo] = useState({});
    const [groupPlayers, setgroupPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    const genders = [{gender: "*", gender_name: "All"}, {gender: "F", gender_name: "Female"}, {gender: "M", gender_name: "Male"}];
    const [isOpenModal, openModal, closeModal] = useModal();
    const players = useList('player');
    const [searchOptions, setSearchOptions] = useState({filter_gender: "*", filter_age: "", filter_fullname: ""});
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        async function fetchGroup() {
            const res = await getList("group/admin/" + globalGroupId);
            setGroupInfo(res[0]);
        };
        fetchGroup();
    }, [globalGroupId]); 

    useEffect(() => {
        async function fetchGroupPlayer() {
            const res = await getList("group-player/" + globalGroupId);
            setgroupPlayers(res);
        };
        fetchGroupPlayer();
    }, [globalGroupId]); 

    const openFilter = () => {
        openModal();
    };

    const handleSearchOptions = (e) => {
        setSearchOptions({
            ...searchOptions,
            [e.target.name]: e.target.value
        });
    };

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
        if(selected.length === 0) {
            return player;
        } else if (!selected.includes(player)) {
            return player;
        };
        return null;
    };    
    
    const addSelected = (player) => {
        setSelected([...selected, player]);
    };

    const removeSelected = (player) => {
        setSelected(selected.filter(item => item.player_id !== player.player_id));
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <Modal.ForForm isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title='Filter'>
                    <Select.Basic name="filter_gender" content={genders} action={handleSearchOptions}/>
                    <Input.Basic name="filter_age" placeholder="All ages" action={handleSearchOptions}/>
                    <Input.Basic name="filter_fullname" action={handleSearchOptions}/>
                    <DivSelected>
                        {selected.map(player => (
                            <div className="item-container" key={player.player_id}>
                                <p>{player.player_fullname}</p>
                                <Icon.Basic family="remove" action={() => removeSelected(player)} />
                            </div>
                        ))}
                        {selected.length > 0 && <Button.Basic family="add" fit height="auto" size="11px" margin="0 0 0 15px">Ready</Button.Basic>}
                    </DivSelected>
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
                                            <Icon.Basic family="check" action={() => addSelected(player)} hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Card.Primary>
            </Modal.ForForm>

            <DivTitle>
                <h2>{groupInfo?.championship_name}</h2>
                <h1>{groupInfo?.name}</h1>
            </DivTitle>

            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <Icon.Basic family="addPerson" action={() => openFilter()} right="12px" hover/>
            </div>
            
            <Container.Table>
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
                            } else if (val.user_fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return val;
                            };
                            return null;
                        }).map(groupPlayer => (
                            <tr key={groupPlayer.group_player_id}>
                                <td data-label='Player'>{groupPlayer.user_fullname}</td>
                                <td data-label=''>
                                    <div className="td-container">
                                        <Icon.Basic family="delete" hover/>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table.Primary>
            </Container.Table>
            
        </Container.Primary>
    );
};

export default GroupAdmin;