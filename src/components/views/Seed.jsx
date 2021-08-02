import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Icon, Modal, Button, TableNew, Container, Loading, Title, Dialog, Avatar, ButtonFloat } from "../../component.controls";
import { PlayerAssigned, PlayerSearch } from "../../component.pieces";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/list.helper'; 
import axios from '../../config/axios';
import useList from '../../hooks/useList';
import { useHistory, useParams } from 'react-router-dom';
import { filterPlayerPropertyByPlayerArray } from "../../helpers/filter.helper";

const Seed = () => {
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

    // USEMODAL #####################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPlayerSearch, openModalPlayerSearch, closeModalPlayerSearch] = useModal();
    const [isOpenModalPlayerAssigned, openModalPlayerAssigned, closeModalPlayerAssigned] = useModal();    
    const [isOpenModalPlayerAssignedReadOnly, openModalPlayerAssignedReadOnly, closeModalPlayerAssignedReadOnly] = useModal();    

    // CRUD VALIDATIONS ############################################################################################################################# 
    const schemaCrud = Yup.object().shape({
        name: Yup.string().required('Required')
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
            const res = await axios.post("group", {group_id: currentGroupId, ...data});
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
            if (res.data.result.cod === 0) return fetchGroupPlayers(currentGroupId);
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
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

    const generarJuegos = async group_id => {
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
        if (group.state_id === 3) {
            openModalPlayerAssigned();
        } else {
            openModalPlayerAssignedReadOnly();
        };       
    };

    const handleGoToMatch = (e, group) => {
        e.stopPropagation();
        history.push('/match/' + group.group_id);
    };

    const handleGoBack = e => {
        e.stopPropagation();
        history.push('/championship');
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

    const handleCloseModalPlayerAssignedReadOnly = () => {
        fetchGroups(prm_championship_id);
        closeModalPlayerAssignedReadOnly();
    };

    const handleCloseGroup = (e, group) => {
        e.stopPropagation();
        setDialogOptions({
            family: "question", 
            title: 'Starting round', 
            text: 'Are you sure you want to start this Fase?', 
            subtext: 'After this you will not be able to modify the competitors.',
            action: () => generarJuegos(group.group_id)
        });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Round</th>
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
                {group.count_players >= 2 && group.state_id === 3 && 
                    <Icon.Basic 
                        onClick={e => handleCloseGroup(e, group)}
                        family="commit" 
                        hover
                    />
                }
                {group.state_id === 1 && 
                    <Icon.Basic 
                        onClick={e => handleGoToMatch(e, group)}
                        family="go" 
                        hover
                    />
                }
            </div>
        );
    };

    const renderAvatar = user => {
        return <Avatar.Letter backColor="#76b101">{user.name[0]}</Avatar.Letter>
    };

    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <Container.Flex alignItems="flex-start">
                {groups[0]?.championship_name}{"  >>  "}{groups[0]?.championship_type_name}
            </Container.Flex>

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
            <PlayerAssigned.ReadOnly players={groupPlayers} isOpen={isOpenModalPlayerAssignedReadOnly} close={handleCloseModalPlayerAssignedReadOnly} /> 
            
            {/* PLAYER ASSIGN MODAL ################################################################################################################# */}
            <PlayerAssigned.Basic actionDelete={updateGroupPlayerIsActive} actionOpen={openModalPlayerSearch} players={groupPlayers} isOpen={isOpenModalPlayerAssigned} close={handleCloseModalPlayerAssigned} /> 
            
            {/* PLAYER SELECTION MODAL ############################################################################################################## */}
            <PlayerSearch action={updateGroupPlayers} players={playerList.filter(filterPlayerPropertyByPlayerArray(playerList))} isOpen={isOpenModalPlayerSearch} close={closeModalPlayerSearch} />

            {/* BACK ################################################################################################################################ */}
            <ButtonFloat.Icon hover onClick={e => handleGoBack(e)} family="back" bottom="85px" right="35px" size="40px" />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon hover onClick={e => handleModalCrud(e, defaultGroupData)} family="add" />

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Primary>
    );
};

export default Seed;