import { useState } from "react";
import { Input, Icon, Button, Select, Table, Container, Title, Modal } from "../../component.controls";
import useList from '../../hooks/useList';
import { filterPlayerGenderIdByText, filterPlayerAgeByText, filterPlayerFullnameByText, filterPlayerObjectByPlayerArray } from "../../helpers/filter.helper";

const PlayerSearch = ({action, players, isOpen, close}) => {
    // LIST #########################################################################################################################################
    const genderList = useList("list/gender");

    // STATE ########################################################################################################################################
    const [playerSelected, setPlayerSelected] = useState([]);
    const [hasFilter, setHasFilter] = useState(false);

    // CONST ########################################################################################################################################
    const defaultSearchOptions = {filter_gender: "", filter_age: "", filter_fullname: ""};
    const [searchOptions, setSearchOptions] = useState(defaultSearchOptions);
    const playerListFiltered = players
        .filter(filterPlayerGenderIdByText(searchOptions.filter_gender))
        .filter(filterPlayerAgeByText(searchOptions.filter_age))
        .filter(filterPlayerFullnameByText(searchOptions.filter_fullname))
        .filter(filterPlayerObjectByPlayerArray(playerSelected));

    // HANDLES ######################################################################################################################################
    const handleAddAllPlayer = () => {
        setPlayerSelected([...playerSelected, ...playerListFiltered]);
    };
    
    const handleAddPlayerSelected = player => {
        setPlayerSelected([...playerSelected, player]);
    };

    const handleRemovePlayerSelected = player => {
        setPlayerSelected(playerSelected.filter(item => item.player_id !== player.player_id));
    };

    const handleSearchOptions = e => {
        setSearchOptions({
            ...searchOptions,
            [e.target.name]: e.target.value
        });
    };

    const handleClose = () => {
        setSearchOptions(defaultSearchOptions);
        setPlayerSelected([]);
        setHasFilter(false);
        close();
    };

    const handleExecAction = () => {
        action(playerSelected);
        setSearchOptions(defaultSearchOptions);
        setPlayerSelected([]);
        setHasFilter(false);
        close();
    };

    // RENDERS ######################################################################################################################################
    const renderFilterOptions = () => {
        return (
            <>
                <Select.Filter name="filter_gender" text="All the guys" value={searchOptions.filter_gender} content={genderList} action={handleSearchOptions}/>
                <Input.Basic name="filter_age" value={searchOptions.filter_age} placeholder="Filter by age..." action={handleSearchOptions}/>
                <Input.Basic name="filter_fullname" value={searchOptions.filter_fullname} placeholder="Filter by name" action={handleSearchOptions}/>
            </>
        );
    };

    const renderPlayersSelected = () => {
        return (
            <Container.Label>
                {playerSelected.map(player => (
                    <div className="item-container" key={player.player_id}>
                        <p>{player.player_fullname}</p>
                        <Icon.Basic family="remove" onClick={() => handleRemovePlayerSelected(player)} />
                    </div>
                ))}
                {playerSelected.length > 0 && <Button.Basic family="search" onClick={() => handleExecAction()} fit height="auto" weight="100" size="11px" margin="0 0 0 15px">assign {playerSelected.length} player(s)</Button.Basic>}
            </Container.Label>
        );
    };

    const renderTableHead = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>
                    <div className="td-container">
                        <Icon.Basic family="dobleCheck" onClick={() => handleAddAllPlayer()} hover/>
                    </div>
                </th>
            </tr>
        );
    };

    const renderTableRows = player => {
        return (
            <tr key={player.player_id}> 
                <td data-label='Name'>{player.player_fullname}</td>
                <td data-label='Gender'>{player.gender_name}</td>
                <td data-label='Age'>{player.player_age}</td>
                <td>
                    <div className="td-container">
                        <Icon.Basic family="check" onClick={() => handleAddPlayerSelected(player)} hover/>
                    </div>
                </td>
            </tr>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <Modal.ForForm isOpen={isOpen} closeModal={handleClose}>
            <Container.Basic>
                <Title.Basic>
                    Select players
                    <Icon.Basic family="filter" onClick={() => setHasFilter(!hasFilter)} hover size="30px" left="10px" top="10px" />
                </Title.Basic>

                {hasFilter && renderFilterOptions()}

                {playerSelected.length > 0 && renderPlayersSelected()}

                <Table.Primary margin="10px 0 0 0">
                    <thead>{renderTableHead()}</thead>
                    <tbody>{playerListFiltered.map(player => renderTableRows(player))}</tbody>
                </Table.Primary>

            </Container.Basic>
        </Modal.ForForm>
    );
};

export default PlayerSearch;