import { useState } from "react";
import { useForm } from "react-hook-form";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../config/axios';
import { useHistory, useParams } from 'react-router-dom';
import { Input, Modal, Button, TableNew, Container, Loading, Title, Dialog, ButtonFloat, Avatar, DropDown } from "../component.controls";
import { PlayersAssigned } from "../component.pieces";
import { useGroup } from "../../custom-hooks/useGroup";
import { useGroupPlayer } from "../../custom-hooks/useGroupPlayer";

const Group = () => {
    // HISTORY ######################################################################################################################################
    const history = useHistory();

    // USE PARAMS ###################################################################################################################################
    const { prm_championship_id, prm_championship_type_id } = useParams();

    // CUSTOM HOOKS #################################################################################################################################
    const { groups, fetchGroupsByChampionshipId, loading } = useGroup("fetchGroupsByChampionshipId", prm_championship_id);
    const { groupPlayers, fetchGroupPlayersByGroupId } = useGroupPlayer();

    // DEFAULT DATA #################################################################################################################################
    const defaultGroupData = {group_id: 0, group_name: ''};
    
    // STATE ########################################################################################################################################
    const [currentGroup, setCurrentGroup] = useState({});
    const [playersAssignedOptions, setPlayersAssignedOptions] = useState({isSearchable: false, isRemovable: false, isDropable: false});
    
    // DIALOG #######################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // USEMODAL #####################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPlayerAssigned, openModalPlayerAssigned, closeModalPlayerAssigned] = useModal();    

    // CRUD VALIDATIONS ############################################################################################################################# 
    const schemaCrud = Yup.object().shape({
        group_name: Yup.string()
            .required('Required')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // CRUD #########################################################################################################################################
    const updateGroup = async data => {
        try {
            const res = await axios.post("group", {group_id: currentGroup.group_id, championship_id: prm_championship_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchGroupsByChampionshipId(prm_championship_id);
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
            fetchGroupPlayersByGroupId(currentGroup.group_id);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateGroupPlayersLocation = async (group_player_id_source, group_player_id_destination) => {
        try {
            const res = await axios.post("group-player/location", {group_player_id_source, group_player_id_destination});
            if (res.data.result.cod !== 0) return setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg});
            fetchGroupPlayersByGroupId(currentGroup.group_id);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateGroupPlayerIsActive = async player_id => {
        try {
            const res = await axios.put("group-player" , {group_id: currentGroup.group_id, player_id});
            if (res.data.result.cod === 0) return fetchGroupPlayersByGroupId(currentGroup.group_id);
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateGroupIsActive = async group_id => {
        try {
            const res = await axios.put("group/" + group_id);
            if (!res.data.error) {
                fetchGroupsByChampionshipId(prm_championship_id);
            };
        } catch (err) {
            console.log(err);
        };
    };

    const resetRandomMatchesByGroupId = async group_id => {
        try {
            const res = await axios.post("match/random/", {group_id});
            if (res.data.result.cod === 0) return fetchGroupsByChampionshipId(prm_championship_id);
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
        console.log("group", group);
        e.stopPropagation();
        setCurrentGroup(group);
        fetchGroupPlayersByGroupId(group.group_id);
        if (group.location === 1) {
            if(group.state_name === "Pending") {
                setPlayersAssignedOptions({isSearchable: true, isRemovable: true, isDropable: true});
            } else {
                setPlayersAssignedOptions({isSearchable: false, isRemovable: false, isDropable: false});
            };
        } else {
            if(group.state_name === "Pending") {
                setPlayersAssignedOptions({isSearchable: false, isRemovable: false, isDropable: true});
            } else {
                setPlayersAssignedOptions({isSearchable: false, isRemovable: false, isDropable: false});
            };
        };
        openModalPlayerAssigned();
    };

    const handleGoMatch = (e, group) => {
        e.stopPropagation();
        return history.push('/match/' + prm_championship_id + '/' + prm_championship_type_id + '/' + group.group_id); 
    };

    const handleGoBack = e => {
        e.stopPropagation();
        history.push('/championship');
    };

    const handleUpdate = (e, group) => {
        e.stopPropagation();
        setCurrentGroup(group);
        resetCrud(group);
        openModalCrud();
    };

    const handleCloseModalPlayerAssigned = () => {
        fetchGroupsByChampionshipId(prm_championship_id);
        closeModalPlayerAssigned();
    };

    const handleResetRandomMatches = (e, group) => {
        e.stopPropagation();
        setDialogOptions({
            family: "question", 
            title: 'Starting round', 
            text: 'Are you sure you want to start this Fase?', 
            subtext: 'After this you will not be able to modify the competitors.',
            action: () => resetRandomMatchesByGroupId(group.group_id)
        });
    };

    const handleDelete = (e, group) => {
        e.stopPropagation();
        setDialogOptions({
            family: "delete", 
            title: 'Delete this group?', 
            text: 'Are you sure you want to delete this group?', 
            action: () => updateGroupIsActive(group.group_id)
        });
    }; 

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>{prm_championship_type_id === 1 ? "Group" : "Round"}</th>
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
                    <div className="dropdown">
                        {renderDropDown(group)}
                    </div>
                </td>
                <td className={classContent} data-label='State'>{group.state_name}</td>
                <td className={classContent} data-label='Players'>{renderButtonPlayer(group)}</td>
                <td className={classContent} data-label='Matches'>{renderButtonMatches(group)}</td>
                <td className={classActions}>{renderActions(group)}</td>
            </tr>  
        );
    };

    const renderAvatar = group => {
        return (
            <div className="avatar-container">
                <Avatar.Letter backColor="#76b101">{group.group_name[0]}</Avatar.Letter>
                {group.group_name}
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

    const renderButtonMatches = group => {
        var text = "", family = "";
        if (group.count_matches > 0) {
            text = group.count_finished_matches + "/" + group.count_matches + " Matches";
            family = "addPerson";
        } else {
            text = "No Matches";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleGoMatch(e, group)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderDropDown = group => {
        return (
            <DropDown.Basic family="more">
                <div className="menu-content" onClick={e => handleUpdate(e, group)}>Update</div>
                <div className="menu-content" onClick={e => handleDelete(e, group)}>Delete</div>
                {group.count_players >= 2 && group.state_id === 3 && <div className="menu-content" onClick={e => handleResetRandomMatches(e, group)}>Start round</div>}
                {group.state_id === 1 && <div className="menu-content" onClick={e => handleGoMatch(e, group)}>Matches</div>}
            </DropDown.Basic>
        );
    };

    const renderActions = group => {
        return (
            <div className="td-container">
               {renderDropDown(group)}
            </div>
        );
    };

    const renderTitle = championship_type_id => {
        return <Title.Basic fontSize="20px">{championship_type_id === 1 ? "Groups" : "Rounds"}</Title.Basic>;
    };

    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            {renderTitle(prm_championship_id)}
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
                    <Input.TextValidation name="group_name" placeholder="Name" register={registerCrud} error={errorsCrud.group_name} />
                    <Button.Basic onClick={handleSubmitCrud(updateGroup)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>

            {/* PLAYER ASSIGN MODAL ################################################################################################################# */}
            <PlayersAssigned actionRemove={updateGroupPlayerIsActive} actionAdd={updateGroupPlayers} actionReorder={updateGroupPlayersLocation} playersAssigned={groupPlayers} isOpen={isOpenModalPlayerAssigned} close={handleCloseModalPlayerAssigned} isSearchable={playersAssignedOptions.isSearchable} isRemovable={playersAssignedOptions.isRemovable} isDropable={playersAssignedOptions.isDropable} /> 

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* BUTTON NEW ########################################################################################################################## */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultGroupData)} family="newFloat" bottom="65px" hover />

            {/* BUTTON BACK ######################################################################################################################### */}
            <ButtonFloat.Icon onClick={e => handleGoBack(e)} family="backFloat" hover />

        </Container.Primary>
    );
};

export default Group;