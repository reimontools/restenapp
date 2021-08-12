import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Title, Modal, Button, Select, TableNew, Container, Loading, Dialog, Image, ButtonFloat, DropDown } from "../component.controls";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../config/axios'
import moment from 'moment';
import { filterPlayerFullnameByText } from "../../helpers/filter.helper";
import { usePlayer } from "../../custom-hooks/usePlayer";
import { useGender } from "../../custom-hooks/useGender";
import { Search } from "../component.pieces";

const Player = () => {
    // CUSTOM HOOKS #################################################################################################################################
    const { players, fetchPlayers, loading } = usePlayer("fetchPlayers");
    const { genders } = useGender("fetchGenders");

    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();

    // CONST ########################################################################################################################################
    const defaultPlayerData = {player_id: 0, name: '', surname: '', gender_id: 1, birth_date: ''};
    
    // STATE ########################################################################################################################################
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPlayerId, setCurrentPlayerId] = useState(0);   
    const [dialogOptions, setDialogOptions] = useState({});
    
    /*VALIDATIONS ####################################################################################*/ 
    const schemaCrud = Yup.object().shape({
        name: Yup.string().required('Required'),
        surname: Yup.string().required('Required'),
        birth_date: Yup
            .date()
            .nullable()
            .transform((curr, orig) => orig === '' ? null : curr)
            .max(moment().subtract(2, 'years').calendar(), "Too young")
            .min(moment().subtract(70, 'years').calendar(), "Too old")
            .required('Required')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schemaCrud)
    });

    // CRUD #########################################################################################################################################
    const updatePlayer = async data => {
        try {
            const res = await axios.post("player", {player_id: currentPlayerId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchPlayers();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'player already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'player already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const updatePlayerIsActive = async player_id => {
        try {
            const res = await axios.put("player/" + player_id);
            if (!res.data.error) {
                fetchPlayers();
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = player_id => {
        if (player_id === currentPlayerId) {
            setCurrentPlayerId(0);
        } else {
            setCurrentPlayerId(player_id);
        };
    };

    const handleUpdate = (e, player) => {
        e.stopPropagation();
        setCurrentPlayerId(player.player_id);
        resetCrud(player);
        openModalCrud();
    };

    const handleDelete = (e, player) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this player?', text: 'Are you sure you want to delete this player?', action: () => updatePlayerIsActive(player.player_id) });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Birth Date</th>
                <th>Age</th>
                <th>Actions</th>
            </tr>
        );
    };

    const renderTableRows = player => {
        var classContent = "";
        var classActions = "";

        if (player.player_id === currentPlayerId) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={player.player_id} onClick={() => handleExpandir(player.player_id)}>
                <td className="head">
                    {renderAvatar(player)}
                    <div className="dropdown">
                        {renderDropDown(player)}
                    </div>
                </td>
                <td className={classContent} data-label='Gender'>{player.gender_name}</td>
                <td className={classContent} data-label='Birth Date'>{moment(player.birth_date).format('YYYY-MM-DD')}</td>
                <td className={classContent} data-label='Age'>{player.player_age}</td>
                <td className={classActions}>{renderActions(player)}</td>
            </tr>  
        );
    };

    const renderDropDown = player => {
        return (
            <DropDown.Basic family="more">
                <div className="menu-content" onClick={e => handleUpdate(e, player)}>Update</div>
                <div className="menu-content" onClick={e => handleDelete(e, player)}>Delete</div>
            </DropDown.Basic>
        );
    };

    const renderActions = player => {
        return (
            <div className="td-container">
               {renderDropDown(player)}
            </div>
        );
    };

    const renderAvatar = player => {
        const family = player.gender_id === 1 ? "girl" : "boy";
        return (
            <div className="avatar-container">
                <Image.Basic family={family} />
                {player.player_fullname}
            </div>
        );
    };

    /*JSX ###########################################################################################################################################*/ 
    return (
        <Container.Primary>
            <Search value={searchTerm} action={setSearchTerm} />
            {loading 
                ? <Loading/> 
                : <Container.Table>
                    <TableNew.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{players.filter(filterPlayerFullnameByText(searchTerm)).map(player => renderTableRows(player))}</tbody>
                    </TableNew.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentPlayerId === 0 ? 'New Player' : 'Update Player'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={registerCrud} error={errorsCrud.name} />
                    <Input.TextValidation name="surname" placeholder="Surname" register={registerCrud} error={errorsCrud.surname} />
                    <Select.Validation name="gender_id" type="select" register={registerCrud} content={genders} />
                    <Input.DateValidation name="birth_date" register={registerCrud} error={errorsCrud.birth_date}/>
                    <Button.Basic onClick={handleSubmitCrud(updatePlayer)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultPlayerData)} family="newFloat" hover />
        </Container.Primary>
    );
};

export default Player;