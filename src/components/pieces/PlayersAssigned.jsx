
import { Title, ModalNew, Image2, Icon } from "../component.controls";
import { ContainerPlayer, ContainerPlayers } from "../styled/playersAssigned.styled";
import { usePlayer } from "../../custom-hooks/usePlayer";
import { PlayerSearch } from "../component.pieces";
import { filterPlayerPropertyByPlayerArray} from "../../helpers/filter.helper";
import useModal from "../../hooks/useModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PlayersAssigned = ({actionRemove, actionAdd, actionReorder, playersAssigned, close, isOpen, isDropable = false, isSearchable = false, isRemovable = false}) => {
    // CUSTOM HOOKS #################################################################################################################################
    const { players: allPlayers } = usePlayer("fetchPlayers");

    // MODAL ########################################################################################################################################
    const [isOpenModalPlayerSearch, openModalPlayerSearch, closeModalPlayerSearch] = useModal();
    
    // HANDLES ######################################################################################################################################
    const handleOnDragEnd = result => {
        if (isDropable && result.destination) {
            actionReorder(playersAssigned[result.source.index].group_player_id, playersAssigned[result.destination.index].group_player_id)
            const newArray = handleReorder(playersAssigned, result.source.index, result.destination.index);
            // console.log("newArray", newArray);
            playersAssigned = newArray;
        };
    };

    const handleReorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    // RENDER #######################################################################################################################################
    const renderTitle = () => {
        return (
            <Title.Basic margin="5px 0">
                {isSearchable && <Icon.Basic family="search" onClick={() => openModalPlayerSearch()} hover left="10px" top="10px" size="20px" />}
                Assigned players
            </Title.Basic>
        );     
    };

    const renderPlayers = players => {
        // if(players.length === 0) return null;
        return (
            <ContainerPlayers>
                {players.map(player => renderPlayer(player))}
            </ContainerPlayers>
        );
    };

    const renderPlayer = player => {
        return (
            <ContainerPlayer key={player.player_id}>
                {renderAvatar(player)}
                {player.player_fullname}
            </ContainerPlayer>
        );
    };

    const renderPlayersDropable = players => {
        if(players.length === 0) return null;
        return (
            <DragDropContext onDragEnd={result => handleOnDragEnd(result)}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <ContainerPlayers {...provided.droppableProps} ref={provided.innerRef}>
                            {players.map((player, index) => (
                                <Draggable key={player.player_fullname} draggableId={player.player_fullname} index={index}>
                                    {(provided, snapshot) => (
                                        <ContainerPlayer key={player.player_id} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps} isDragging={snapshot.isDragging} gender={player.gender_id}>
                                            {renderAvatar(player)}
                                            {player.player_fullname}
                                        </ContainerPlayer>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ContainerPlayers>
                    )}
                </Droppable>
            </DragDropContext>
        );
    };

    const renderAvatar = player => {
        const family = player.gender_id === 1 ? "girl" : "boy";
        return isRemovable ? <Image2.BasicDelete family={family} onClick={() => actionRemove(player.player_id)} /> : <Image2.Basic family={family} />;
    };

    const renderPlayerAssigned = players => {
        return (
            <>
                <ModalNew.ForForm isOpen={isOpen} closeModal={close}>
                    {renderTitle()}
                    {isDropable ? renderPlayersDropable(players) : renderPlayers(players)}
                </ModalNew.ForForm>

                {/* SCORE TO SELECT ################################################################################################################# */}
                <PlayerSearch action={actionAdd} players={allPlayers.filter(filterPlayerPropertyByPlayerArray(playersAssigned))} isOpen={isOpenModalPlayerSearch} close={closeModalPlayerSearch} 
                />
            </>
        );
    };

    // RETURN #######################################################################################################################################
    return renderPlayerAssigned(playersAssigned);
};

export default PlayersAssigned;