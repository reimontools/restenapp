import { Icon, Table, Container, Title, Modal } from "../../component";

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
                <td data-label='Player'>{player.player_fullname}</td>
                <td data-label=''>
                    <div className="td-container">
                        <Icon.Basic family="delete" onClick={() => actionDelete(player.player_id)} hover/>
                    </div>
                </td>
            </tr>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <Modal.ForForm isOpen={isOpen} closeModal={close}>
            <Container.Basic>
                <Title.Basic>
                    Assigned players
                    <Icon.Basic family="search" onClick={() => actionOpen()} hover size="30px" left="10px" top="10px"/>
                </Title.Basic>
                {players.length > 0 &&
                    <Table.Primary margin="10px 0 0 0">
                        <thead>{renderTableHead()}</thead>
                        <tbody>{players.map(player => renderTableRows(player))}</tbody>
                    </Table.Primary>
                }
            </Container.Basic>
        </Modal.ForForm>
    );
};

export default PlayerSearch;