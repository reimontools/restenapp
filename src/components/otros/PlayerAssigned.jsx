import { Icon, TableNew, Container, Title, Modal, Avatar } from "../../component";

const PlayerSearch = ({actionDelete, actionOpen, players, isOpen, close}) => {
    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Players</th>
                <th>Action</th>
            </tr>
        );
    };

    const renderTableRows = player => {
        return (
            <tr key={player.player_id}>
                <td className="head">
                    {renderAvatarByPlayer(player)}
                    {player.player_fullname}
                </td>
                <td className="hide">{renderActions(player)}</td>
            </tr>  
        );
    };

    const renderActions = player => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    onClick={() => actionDelete(player.player_id)}
                    family="delete" 
                    hover
                />
            </div>
        );
    };

    const renderAvatarByPlayer = player => {
        if (player.gender_id === 1) return <Avatar.Delete onClick={() => actionDelete(player.player_id)} backColor="#f9d2df">{player.name[0]}</Avatar.Delete>
        if (player.gender_id === 2) return <Avatar.Delete onClick={() => actionDelete(player.player_id)} backColor="#d3e5f1">{player.name[0]}</Avatar.Delete>
        return null;        
    };

    // JSX ##########################################################################################################################################
    return (
        <Modal.ForForm isOpen={isOpen} closeModal={close}>
            <Container.Basic>
                <Title.Basic>
                    Assigned players
                    <Icon.Basic family="search" onClick={() => actionOpen()} hover size="25px" left="10px" top="10px"/>
                </Title.Basic>
                {players.length > 0 &&
                    <TableNew.Basic margin="10px 0 0 0" borderBottom="none">
                        <thead>{renderTableHead()}</thead>
                        <tbody>{players.map(player => renderTableRows(player))}</tbody>
                    </TableNew.Basic>
                }
            </Container.Basic>
        </Modal.ForForm>
    );
};

export default PlayerSearch;