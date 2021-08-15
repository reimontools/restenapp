import { useState } from "react";
import { Button, Title, TableNew, Container, Loading, Dialog, ButtonFloat, DropDown, Image, Message } from "../../component.controls";
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { filterChampionshipNameStateByText } from "../../../helpers/filter.helper";
import { useChampionship } from "../../../custom-hooks/useChampionship";
import { Search } from "../../component.pieces";
import { MSG_NO_MATCH } from "../../../helpers/parameters.helper";
import ChampionshipCrud from "./ChampionshipCrud";

const Championship = () => {
    // HISTORY ######################################################################################################################################
    const history = useHistory();

    // CUSTOM HOOKS ###############################################################################################################################
    const {championships, fetchChampionships, loading} = useChampionship("fetchChampionships");
    const [isOpenModalChampionshipCrud, openModalChampionshipCrud, closeModalChampionshipCrud] = useModal();

    // DEFAULT DATA #################################################################################################################################
    const defaultChampionshipData = {championship_id: 0, championship_name: '', state: 0, championship_type_id: ""};
    
    // STATE ########################################################################################################################################
    const [currentChampionship, setCurrentChampionship] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD #########################################################################################################################################
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
    const handleExpandir = championship => {
        if (championship.championship_id === currentChampionship.championship_id) {
            setCurrentChampionship({});
        } else {
            setCurrentChampionship(championship);
        };
    };

    const handleChampionshipState = (e, championship) => {
        e.stopPropagation();
        if (championship.state_id === 1) updateChampionshipState(championship.championship_id, 2);
        if (championship.state_id === 2) updateChampionshipState(championship.championship_id, 1);
    };

    const handleModalChampionshipCrud = (e, championship) => {
        e.stopPropagation();
        setCurrentChampionship(championship);
        openModalChampionshipCrud();
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

        if (championship.championship_id === currentChampionship.championship_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={championship.championship_id} onClick={() => handleExpandir(championship)}>
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
                <div className="menu-content" onClick={e => handleModalChampionshipCrud(e, championship)}>Update</div>
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

    const renderTitle = () => {
        return <Title.Basic flexJustifyContent="flex-start" margin="13px 0 7px 0" width="90%">Championships</Title.Basic>;
    };

    const renderChampionships = championships => {
        if (!championships) return null;
        if (championships.length === 0) return <Message text={MSG_NO_MATCH} />
        return (
            <>
                <Search value={searchTerm} action={setSearchTerm} placeholder="By Name or State" />
                <Container.Table>
                    <TableNew.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{championships.filter(filterChampionshipNameStateByText(searchTerm)).map(championship => renderTableRows(championship))}</tbody>
                    </TableNew.Basic>
                </Container.Table>
            </>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <>
            <Container.Primary>
                {renderTitle()}
                {loading ?<Loading/> :renderChampionships(championships)}
            </Container.Primary>

            {/* CRUD CHAMPIONSHIP ################################################################################################################### */}
            <ChampionshipCrud fetch={fetchChampionships} championship={currentChampionship} isOpen={isOpenModalChampionshipCrud} close={closeModalChampionshipCrud} />

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleModalChampionshipCrud(e, defaultChampionshipData)} family="newFloat" hover />
            
        </>
    );
};

export default Championship;