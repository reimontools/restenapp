import { useState } from "react";
import { Message, Title, TableNew, Container, Loading, Dialog, Image, ButtonFloat, DropDown } from "../../component.controls";
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'
import moment from 'moment';
import { filterPlayerFullnameByText } from "../../../helpers/filter.helper";
import { usePlayer } from "../../../custom-hooks/usePlayer";
import { Search } from "../../component.pieces";
import { MSG_NO_MATCH } from "../../../helpers/parameters.helper";
import PlayerCrud from "./PlayerCrud";

const Player = () => {
    // CUSTOM HOOKS #################################################################################################################################
    const { players, fetchPlayers, loading } = usePlayer("fetchPlayers");
    const [isOpenModalPlayerCrud, openModalPlayerCrud, closeModalPlayerCrud] = useModal();

    // CONST ########################################################################################################################################
    const defaultPlayerData = {player_id: 0, name: '', surname: '', gender_id: '', birth_date: ''};
    
    // STATE ########################################################################################################################################
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState(0);   
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD #########################################################################################################################################
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
    const handleExpandir = player => {
        if (player.player_id === currentPlayer.player_id) {
            setCurrentPlayer({});
        } else {
            setCurrentPlayer(player);
        };
    };

    const handleUpdate = (e, player) => {
        e.stopPropagation();
        setCurrentPlayer(player);
        openModalPlayerCrud();
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

        if (player.player_id === currentPlayer.player_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={player.player_id} onClick={() => handleExpandir(player)}>
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

    const renderTitle = () => {
        return <Title.Basic flexJustifyContent="flex-start" margin="13px 0 7px 0" width="90%">Players</Title.Basic>;
    };

    const renderPlayers = players => {
        if (!players) return null;
        if (players.length === 0) return <Message text={MSG_NO_MATCH} />
        return (
            <>
                <Search value={searchTerm} action={setSearchTerm} placeholder="By Name or Surname" />
                <Container.Table>
                    <TableNew.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{players.filter(filterPlayerFullnameByText(searchTerm)).map(player => renderTableRows(player))}</tbody>
                    </TableNew.Basic>
                </Container.Table>
            </>
        );
    };

    /*JSX ###########################################################################################################################################*/ 
    return (
        <>
            <Container.Primary>
                {renderTitle()}
                {loading ?<Loading/> :renderPlayers(players)}
            </Container.Primary>
            
            {/* CRUD CHAMPIONSHIP ################################################################################################################### */}
            <PlayerCrud fetch={fetchPlayers} player={currentPlayer} isOpen={isOpenModalPlayerCrud} close={closeModalPlayerCrud} />
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultPlayerData)} family="newFloat" hover />
        </>
    );
};

export default Player;