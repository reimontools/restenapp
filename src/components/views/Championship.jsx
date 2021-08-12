import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Modal, Button, Title, TableNew, Container, Loading, Select, Dialog, ButtonFloat, DropDown, Image } from "../component.controls";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../config/axios'
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { filterChampionshipNameStateByText } from "../../helpers/filter.helper";
import { useChampionship } from "../../custom-hooks/useChampionship";
import { useChampionshipType } from "../../custom-hooks/useChampionshipType";
import { Search } from "../component.pieces";

const Championship = () => {
    // HISTORY ######################################################################################################################################
    const history = useHistory();

    // CUSTOM HOOKS ###############################################################################################################################
    const {championships, fetchChampionships, loading} = useChampionship("fetchChampionships");
    const {championshipTypes} = useChampionshipType("fetchChampionshipTypes");
    
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();

    // DEFAULT DATA ########################################################################################################################################
    const defaultChampionshipData = {championship_id: 0, championship_name: '', state: 0, championship_type_id: ""};
    
    // STATE ########################################################################################################################################
    const [currentChampionshipId, setCurrentChampionshipId] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD VALIDATIONS ############################################################################################################################# 
    const schemaCrud = Yup.object().shape({
        championship_name: Yup.string()
            .required('Required'),
        championship_type_id: Yup.string()
            .required('Required')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // CRUD #########################################################################################################################################
    const updateChampionship = async data => {
        try {
            const res = await axios.post("championship", {championship_id: currentChampionshipId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchChampionships();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Championship already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Championship already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const updateChampionshipState = async (id, state_id) => {
        try {
            const res = await axios.post("state/", {state_id, name: "championship", id});
            if (res.data.result.cod === 0) return fetchChampionships();
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateChampionshipIsActive = async id => {
        try {
            const res = await axios.put("championship/" + id);
            if (!res.data.error) {
                fetchChampionships();
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = championship_id => {
        if (championship_id === currentChampionshipId) {
            setCurrentChampionshipId(0);
        } else {
            setCurrentChampionshipId(championship_id);
        };
    };

    const handleChampionshipState = (e, championship) => {
        e.stopPropagation();
        if (championship.state_id === 1) updateChampionshipState(championship.championship_id, 2);
        if (championship.state_id === 2) updateChampionshipState(championship.championship_id, 1);
    };

    const handleUpdate = (e, championship) => {
        e.stopPropagation();
        setCurrentChampionshipId(championship.championship_id);
        resetCrud(championship);
        openModalCrud();
    };

    const handleGoGroup = (e, championship) => {
        e.stopPropagation();
        history.push('/championship/group/' + championship.championship_id + '/' + championship.championship_type_id)
    };

    const handleDelete = (e, championship) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this championship?', text: 'Are you sure you want to delete this championship?', action: () => updateChampionshipIsActive(championship.championship_id) });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Championship</th>
                <th>Type</th>
                <th>Created</th>
                <th>State</th>
                <th>Groups/Rounds</th>
                <th>Actions</th>
            </tr>
        );
    };

    const renderTableRows = championship => {
        var classContent = "";
        var classActions = "";

        if (championship.championship_id === currentChampionshipId) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={championship.championship_id} onClick={() => handleExpandir(championship.championship_id)}>
                <td className="head">
                    {renderAvatar(championship)}
                    <div className="dropdown">
                        {renderDropDown(championship)}
                    </div>
                </td>
                <td className={classContent} data-label='Type'>{championship.championship_type_name}</td>
                <td className={classContent} data-label='Created'>{ moment(championship.created_date).format('YYYY-MM-DD') }</td>
                <td className={classContent} data-label='Status'>{renderButtonState(championship)}</td>
                <td className={classContent} data-label='Groups'>{renderButtonGroups(championship)}</td>
                <td className={classActions}>{renderActions(championship)}</td>
            </tr>  
        );
    };

    const renderDropDown = championship => {
        return (
            <DropDown.Basic family="more">
                <div className="menu-content" onClick={e => handleUpdate(e, championship)}>Update</div>
                <div className="menu-content" onClick={e => handleDelete(e, championship)}>Delete</div>
                {championship.state_id === 1 &&<div className="menu-content" onClick={e => handleGoGroup(e, championship)}>Groups</div>}
            </DropDown.Basic>
        );
    };

    const renderAvatar = championship => {
        if (championship.championship_type_id === 1) {
            return (
                <div className="avatar-container">
                    <Image.Basic family="championshipAgainst" />
                    {championship.championship_name}
                </div>
            );
        };

        if (championship.championship_type_id === 2) {
            return (
                <div className="avatar-container">
                    <Image.Basic family="championshipSeed" />
                    {championship.championship_name}
                </div>
            );
        };

        return null;        
    };

    const renderActions = championship => {
        return (
            <div className="td-container">
               {renderDropDown(championship)}
            </div>
        );
    };

    const renderButtonState = championship => {
        var text = championship.state_name, family = "";
        championship.state_id === 1 ? family = "addPerson" : family = "check";
        return <Button.Basic family={family} onClick={e => handleChampionshipState(e, championship)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderButtonGroups = championship => {
        var text = "", family = "", type = "Groups";
        
        if (championship.championship_type_id !== 1) type = "Rounds";

        if (championship.count_groups > 0) {
            text = championship.count_groups + " " + type;
            family = "addPerson";
        } else {
            text = "No Groups";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleGoGroup(e, championship)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <Search value={searchTerm} action={setSearchTerm} />
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <TableNew.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{championships.filter(filterChampionshipNameStateByText(searchTerm)).map(championship => renderTableRows(championship))}</tbody>
                    </TableNew.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentChampionshipId === 0 ? 'New Championship' : 'Update Championship'}</Title.Basic>
                    <Input.TextValidation name="championship_name" placeholder="Championship name" register={registerCrud} error={errorsCrud.championship_name} />
                    <Select.Validation disable={currentChampionshipId === 0 ? false : true} name="championship_type_id" text="Championship type" register={registerCrud} error={errorsCrud.championship_type_id} content={championshipTypes} />
                    <Button.Basic onClick={handleSubmitCrud(updateChampionship)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultChampionshipData)} family="newFloat" hover />
        </Container.Primary>
    );
};

export default Championship;