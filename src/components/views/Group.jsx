import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios';
import useList from '../../hooks/useList';
import { useHistory, useParams } from 'react-router-dom';
import { Input, Modal, Button, TableNew, Container, Loading, Title, Dialog, PlayerAssigned, PlayerSearch, ButtonFloat, Avatar, Options, IconText, DropDown } from "../../component";

const Group = () => {
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
    const [currentGroup, setCurrentGroup] = useState({});
    const [groupPlayers, setGroupPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // USEMODAL #####################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPlayerSearch, openModalPlayerSearch, closeModalPlayerSearch] = useModal();
    const [isOpenModalPlayerAssigned, openModalPlayerAssigned, closeModalPlayerAssigned] = useModal();    
    const [isOpenModalPlayerAssignedReadOnly, openModalPlayerAssignedReadOnly, closeModalPlayerAssignedReadOnly] = useModal(); 
    
    const [isOpenOptions, openOptions, closeOptions] = useModal();

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
            const res = await axios.post("group", {group_id: currentGroup.group_id, championship_id: prm_championship_id, ...data});
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
            const res = await axios.post("group-player", {group_id: currentGroup.group_id, players});
            if (res.data.result.cod !== 0) return setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg});
            fetchGroupPlayers(currentGroup.group_id);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateGroupPlayerIsActive = async player_id => {
        try {
            const res = await axios.put("group-player" , {group_id: currentGroup.group_id, player_id});
            if (res.data.result.cod === 0) return fetchGroupPlayers(currentGroup.group_id);
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

    const setRandomMatchByGroupId = async group_id => {
        try {
            const res = await axios.post("match", {group_id});
            if (res.data.result.cod === 0) return fetchGroups(prm_championship_id);
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = group => {
        if (group.group_id === currentGroup.group_id) {
            setCurrentGroup(0);
        } else {
            setCurrentGroup(group);
        };
    };
    
    const handleButtonPlayer = (e, group) => {
        e.stopPropagation();
        setCurrentGroup(group);
        fetchGroupPlayers(group.group_id);
        if (group.state_id === 3) {
            openModalPlayerAssigned();
        } else {
            openModalPlayerAssignedReadOnly();
        };    
    };

    const handleGoMatch = (e, group) => {
        e.stopPropagation();
        history.push('/match/' + group.group_id);
    };

    const handleGoBack = e => {
        e.stopPropagation();
        history.push('/championship');
    };

    const handleModalCrud = (e, group) => {
        closeOptions();
        e.stopPropagation();
        setCurrentGroup(group);
        resetCrud(group);
        openModalCrud();
    };

    const handleCloseModalPlayerAssigned = () => {
        fetchGroups(prm_championship_id);
        closeModalPlayerAssigned();
    };

    const handleCloseModalPlayerAssignedReadOnly = () => {
        fetchGroups(prm_championship_id);
        closeModalPlayerAssignedReadOnly();
    };

    const handleSetRandomMatch = (e, group) => {
        closeOptions();
        e.stopPropagation();
        setDialogOptions({
            family: "question", 
            title: 'Starting phase', 
            text: 'Are you sure you want to start this Fase?', 
            subtext: 'After this you will not be able to modify the competitors.',
            action: () => setRandomMatchByGroupId(group.group_id)
        });
    };

    const handleInactiveGroup = (e, group) => {
        handleMore(e, group);
        closeOptions();
        e.stopPropagation();
        setDialogOptions({
            family: "delete", 
            title: 'Delete this group?', 
            text: 'Are you sure you want to delete this group?', 
            action: () => updateGroupIsActive(group.group_id)
        });
    };

    const handleMore = (e, group) => {
        e.stopPropagation();
        setCurrentGroup(group);
        resetCrud(group);
        openOptions();
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
                <th>State</th>
                <th>Players</th>
                <th>Matches</th>
                <th></th>
            </tr>
        );
    };

    const renderTableRows = group => {
        var classContent = "";
        var classActions = "";

        if (group.group_id === currentGroup.group_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={group.group_id} onClick={() => handleExpandir(group)}>
                <td className="head">
                    {renderAvatar(group)}
                    {/* <Icon.Basic className="more" family="more" size="30px" onClick={e => handleMore(e, group)}/> */}
                    {/* <DropDown.Basic /> */}
                </td>
                <td className={classContent} data-label='State'>{group.state_name}</td>
                <td className={classContent} data-label='Players'>{renderButtonPlayer(group)}</td>
                <td className={classContent} data-label='Matches'>2 Matches</td>
                <td className={classActions}>{renderActions(group)}</td>
            </tr>  
        );
    };

    const renderAvatar = group => {
        return (
            <div className="avatar-container">
                <Avatar.Letter backColor="#76b101">{group.name[0]}</Avatar.Letter>
                {group.name}
            </div>
        );
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
               <DropDown.Basic>
                    <IconText.Basic family="edit" onClick={e => handleModalCrud(e, group)}>Update</IconText.Basic>
                    <IconText.Basic family="delete" onClick={e => handleInactiveGroup(e, group)}>Delete</IconText.Basic>
               </DropDown.Basic>
            </div>
        );
    };

    // const renderActions = group => {
    //     return (
    //         <div className="td-container2">
    //             <Icon.Basic 
    //                 onClick={e => handleMore(e, group)} 
    //                 family="more"
    //                 hover
    //                 size="30px"
    //             />
    //         </div>
    //     );
    // };

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
                    <Title.Basic>{currentGroup.group_id === 0 ? 'New Group' : 'Update Group'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={registerCrud} error={errorsCrud.name} />
                    <Button.Basic onClick={handleSubmitCrud(updateGroup)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>

            {/* PLAYER ASSIGN MODAL - READ ONLY ##################################################################################################### */}
            <PlayerAssigned.ReadOnly players={groupPlayers} isOpen={isOpenModalPlayerAssignedReadOnly} close={handleCloseModalPlayerAssignedReadOnly} /> 
            
            {/* PLAYER ASSIGN MODAL ################################################################################################################# */}
            <PlayerAssigned.Basic actionDelete={updateGroupPlayerIsActive} actionOpen={openModalPlayerSearch} players={groupPlayers} isOpen={isOpenModalPlayerAssigned} close={handleCloseModalPlayerAssigned} /> 
            
            {/* PLAYER SELECTION MODAL ############################################################################################################## */}
            <PlayerSearch action={updateGroupPlayers} players={playerList.filter(filByAlreadyOnGroup)} isOpen={isOpenModalPlayerSearch} close={closeModalPlayerSearch} />

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* OPTIONS  ############################################################################################################################ */}
            <Options.Basic isOpen={isOpenOptions} close={closeOptions}>
                <IconText.Basic family="edit" onClick={e => handleModalCrud(e, currentGroup)}>Update</IconText.Basic>
                <IconText.Basic family="delete" onClick={e => handleInactiveGroup(e, currentGroup)}>Delete</IconText.Basic>
                {currentGroup.count_players >= 2 && currentGroup.state_id === 3 && 
                    <IconText.Basic family="commit" onClick={e => handleSetRandomMatch(e, currentGroup)}>Commit</IconText.Basic>
                }
                {currentGroup.state_id === 1 && 
                    <IconText.Basic family="go" onClick={e => handleGoMatch(e, currentGroup)}>Go</IconText.Basic>
                }
            </Options.Basic>

            {/* BUTTON BACK ######################################################################################################################### */}
            <ButtonFloat.Icon hover onClick={e => handleGoBack(e)} family="back" bottom="75px" size="40px" />

            {/* BUTTON NEW ########################################################################################################################## */}
            <ButtonFloat.Icon hover onClick={e => handleModalCrud(e, defaultGroupData)} family="add" />
        </Container.Primary>
    );
};

export default Group;