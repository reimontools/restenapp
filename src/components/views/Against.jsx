import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Icon, Modal, Button, TableNew, Container, Loading, Title, Dialog, PlayerAssigned, PlayerSearch, ButtonFloat, Avatar } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios';
import useList from '../../hooks/useList';
import { useHistory, useParams } from 'react-router-dom';

const Against = () => {
    // LIST #########################################################################################################################################
    const playerList = useList('player');

    // CONST ########################################################################################################################################
    const { prm_championship_id } = useParams();
    const history = useHistory();
    const defaultGroupData = {group_id: 0, name: ''};
    
    // EFFECT #######################################################################################################################################
    useEffect(() => {
        fetchGroups(prm_championship_id);
    }, [prm_championship_id]);

    // STATE ########################################################################################################################################
    const [loading, setLoading] = useState(true);
    const [dialogOptions, setDialogOptions] = useState({});
    const [groups, setGroups] = useState([]);
    const [currentGroupId, setCurrentGroupId] = useState(0);
    const [groupPlayers, setGroupPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // USEMODAL #####################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPlayerSearch, openModalPlayerSearch, closeModalPlayerSearch] = useModal();
    const [isOpenModalPlayerAssigned, openModalPlayerAssigned, closeModalPlayerAssigned] = useModal();    

    // CRUD VALIDATIONS ############################################################################################################################# 
    const schemaCrud = Yup.object().shape({
        name: Yup.string()
            .required('Required')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // FETCHS #######################################################################################################################################
    const fetchGroups = async championship_id => {
        setLoading(true);
        const res = await getList("group/" + championship_id);
        setGroups(res);
        setLoading(false);
    };

    const fetchGroupPlayers = async group_id => {
        const res = await getList("group-player/" + group_id);
        setGroupPlayers(res);
    };

    // CRUD #########################################################################################################################################
    const updateGroup = async data => {
        try {
            const res = await axios.post("group", {group_id: currentGroupId, championship_id: prm_championship_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchGroups(prm_championship_id);
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Group already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Group already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateGroupPlayers = async players => {
        try {
            const res = await axios.post("group-player", {group_id: currentGroupId, players});
            if (res.data.result.cod !== 0) return setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg});
            fetchGroupPlayers(currentGroupId);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateGroupPlayerIsActive = async player_id => {
        try {
            const res = await axios.put("group-player" , {group_id: currentGroupId, player_id});
            if (res.data.result.cod === 0) return fetchGroupPlayers(currentGroupId);
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateGroupIsActive = async group_id => {
        try {
            const res = await axios.put("group/" + group_id);
            if (!res.data.error) {
                fetchGroups(prm_championship_id);
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = group_id => {
        if (group_id === currentGroupId) {
            setCurrentGroupId(0);
        } else {
            setCurrentGroupId(group_id);
        };
    };
    
    const handleButtonPlayer = (e, group) => {
        e.stopPropagation();
        setCurrentGroupId(group.group_id);
        fetchGroupPlayers(group.group_id);
        openModalPlayerAssigned();
    };

    const handleGoToMatch = group => {
        history.push('/match/' + group.group_id);
    };

    const handleModalCrud = (e, group) => {
        e.stopPropagation();
        setCurrentGroupId(group.group_id);
        // fetchGroupPlayers(group.group_id);
        resetCrud(group);
        openModalCrud();
    };

    const handleCloseModalPlayerAssigned = () => {
        fetchGroups(prm_championship_id);
        closeModalPlayerAssigned();
    };

    const handleCloseGroup = (e, group) => {
        e.stopPropagation();
        console.log(group);
    };

    const handleInactiveGroup = (e, group) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this group?', text: 'Are you sure you want to delete this group?', action: () => updateGroupIsActive(group.group_id)});
    };

    // FILTERS ######################################################################################################################################
    function filByAlreadyOnGroup(player) {
        if(groupPlayers.length === 0) {
            return player;
        } else if (!groupPlayers.some(value => value.player_id === player.player_id)) {
            return player;
        };
        return null;
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Group</th>
                <th>Players</th>
                <th>Actions</th>
            </tr>
        );
    };

    const renderTableRows = group => {
        var classContent = "";
        var classActions = "";

        if (group.group_id === currentGroupId) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={group.group_id} onClick={() => handleExpandir(group.group_id)}>
                <td className="head">
                    {renderAvatar(group)}
                    {group.name}
                </td>
                <td className={classContent} data-label='Players'>{renderButtonPlayer(group)}</td>
                <td className={classActions}>{renderActions(group)}</td>
            </tr>  
        );
    };

    const renderAvatar = user => {
        return <Avatar.Letter backColor="#76b101">{user.name[0]}</Avatar.Letter>
    };
    
    const renderButtonPlayer = group => {
        var text = "", family = "";
        if (group.count_players > 0) {
            text = group.count_players + " Players";
            family = "addPerson";
        } else {
            text = "No Players";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleButtonPlayer(e, group)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderActions = group => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    onClick={e => handleModalCrud(e, group)} 
                    family="edit"
                    hover
                />
                <Icon.Basic 
                    onClick={e => handleInactiveGroup(e, group)}
                    family="delete" 
                    hover
                />
                <Icon.Basic 
                    onClick={e => handleGoToMatch(e, group)}
                    family="go" 
                    hover
                />
                <Icon.Basic 
                    onClick={e => handleCloseGroup(e, group)}
                    family="close" 
                    hover
                />
            </div>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <Title.Basic fontSize="20px">{groups[0]?.championship_name}</Title.Basic> 
            <Title.Basic>{groups[0]?.championship_type_name}</Title.Basic>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                
            </div>

            {loading 
                ? <Loading/>
                : <Container.Table>
                    <TableNew.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{groups.map(group => renderTableRows(group))}</tbody>
                    </TableNew.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentGroupId === 0 ? 'New Group' : 'Update Group'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={registerCrud} error={errorsCrud.name} />
                    <Button.Basic onClick={handleSubmitCrud(updateGroup)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            
            {/* PLAYER ASSIGN MODAL ################################################################################################################# */}
            <PlayerAssigned actionDelete={updateGroupPlayerIsActive} actionOpen={openModalPlayerSearch} players={groupPlayers} isOpen={isOpenModalPlayerAssigned} close={handleCloseModalPlayerAssigned} /> 
            
            {/* PLAYER SELECTION MODAL ############################################################################################################## */}
            <PlayerSearch action={updateGroupPlayers} players={playerList.filter(filByAlreadyOnGroup)} isOpen={isOpenModalPlayerSearch} close={closeModalPlayerSearch} />

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon hover onClick={e => handleModalCrud(e, defaultGroupData)} />
        </Container.Primary>
    );
};

export default Against;