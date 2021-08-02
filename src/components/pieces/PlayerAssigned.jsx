import { Icon, TableNew, Container, Title, Modal, Image } from "../../component.controls";

const PlayerSearch = {
    Basic: ({actionDelete, actionOpen, players, isOpen, close}) => {
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
                        {renderAvatar(player)}
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

        const renderAvatar = player => {
            if (player.gender_id === 1) {
                return (
                    <div className="avatar-container">
                        <Image.BasicDelete family="girl" onClick={() => actionDelete(player.player_id)} />
                        {player.player_fullname}
                    </div>
                );
            };
    
            if (player.gender_id === 2) {
                return (
                    <div className="avatar-container">
                        <Image.BasicDelete family="boy" onClick={() => actionDelete(player.player_id)} />
                        {player.player_fullname}
                    </div>
                );
            };
    
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
    },
    ReadOnly: ({players, isOpen, close}) => {
        // RENDERS ######################################################################################################################################
        const renderTableHead = () => {
            return (
                <tr>
                    <th>Players</th>
                </tr>
            );
        };

        const renderTableRows = player => {
            return (
                <tr key={player.player_id}>
                    <td className="head">
                        {renderAvatar(player)}
                    </td>
                </tr>  
            );
        };

        const renderAvatar = player => {
            if (player.gender_id === 1) {
                return (
                    <div className="avatar-container">
                        <Image.Basic family="girl" />
                        {player.player_fullname}
                    </div>
                );
            };
    
            if (player.gender_id === 2) {
                return (
                    <div className="avatar-container">
                        <Image.Basic family="boy" />
                        {player.player_fullname}
                    </div>
                );
            };
    
            return null;        
        };
        
        // JSX ##########################################################################################################################################
        return (
            <Modal.ForForm isOpen={isOpen} closeModal={close}>
                <Container.Basic>
                    <Title.Basic>Assigned players</Title.Basic>
                    {players.length > 0 &&
                        <TableNew.Basic margin="10px 0 0 0" borderBottom="none">
                            <thead>{renderTableHead()}</thead>
                            <tbody>{players.map(player => renderTableRows(player))}</tbody>
                        </TableNew.Basic>
                    }
                </Container.Basic>
            </Modal.ForForm>
        );
    }
};

export default PlayerSearch;
