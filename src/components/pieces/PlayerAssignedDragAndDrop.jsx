import { ModalNew, ImageCircle, Title, Icon } from "../../component.controls";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import styled from "styled-components";

// STYLED ###########################################################################################################################################
const DivListStyled = styled.div `
    background: #ffffff;
    padding: 0 7px;
`;

const DivItemStyled = styled.div `
    padding: 15px;
    margin-bottom: 7px;
    border-radius: 2px;
    user-select: "none";
    background: ${({ isDragging, gender }) => isDragging ? getColorByGender(gender) : "#ebecf0"};
    border: ${({ isDragging }) => isDragging ? "2px solid #091e42b5" : "none"};
`;

const getColorByGender = gender => {
    if (gender === 1) return "#eae6ff";
    return "#e6fceb";
};

const DivAvatarContainerStyled = styled.div `
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

// COMPONENT ########################################################################################################################################
const PlayerAssignedDragAndDrop = {
    Basic: ({actionLocation, actionOpen, actionDelete, players, isOpen, close, dragDrop = false, readOnly = false}) => {

        // RENDERS ##################################################################################################################################
        const renderAvatar = player => {
            if (player.gender_id === 1) {
                return (
                    <DivAvatarContainerStyled>
                        {readOnly ? <ImageCircle.Basic family="girl" /> : <ImageCircle.BasicDelete family="girl" onClick={() => actionDelete(player.player_id)}/>}
                        {player.player_fullname}
                    </DivAvatarContainerStyled>
                );
            };
            if (player.gender_id === 2) {
                return (
                    <DivAvatarContainerStyled className="avatar-container">
                        {readOnly ? <ImageCircle.Basic family="boy" /> : <ImageCircle.BasicDelete family="boy" onClick={() => actionDelete(player.player_id)}/>}
                        {player.player_fullname}
                    </DivAvatarContainerStyled>
                );
            };
            return null;        
        };

        // HANDLE ###################################################################################################################################
        const handleOnDragEnd = result => {
            if (dragDrop && result.destination) {
                actionLocation(players[result.source.index].group_player_id, players[result.destination.index].group_player_id)
                const newArray = handleReorder(players, result.source.index, result.destination.index);
                console.log("newArray", newArray);
                players = newArray;
            };
        };

        const handleReorder = (list, startIndex, endIndex) => {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        };

        // JSX ######################################################################################################################################
        return (
            <ModalNew.ForForm isOpen={isOpen} closeModal={close}>
                <Title.Basic margin="5px">
                    Assigned players
                    {!readOnly && <Icon.Basic family="search" onClick={() => actionOpen()} hover size="25px" left="10px" top="5px"/>}
                </Title.Basic>
                <DragDropContext onDragEnd={result => handleOnDragEnd(result)}>
                    <Droppable droppableId="droppable">
                        {provided => (
                            <DivListStyled {...provided.droppableProps} ref={provided.innerRef}>
                                {players.map((player, index) => (
                                    <Draggable key={player.player_fullname} draggableId={player.player_fullname} index={index}>
                                        {(provided, snapshot) => (
                                            <DivItemStyled {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps} isDragging={snapshot.isDragging} gender={player.gender_id}>
                                                {renderAvatar(player)}
                                            </DivItemStyled>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </DivListStyled>
                        )}
                    </Droppable>
                </DragDropContext>
            </ModalNew.ForForm>
        );
    }
};

export default PlayerAssignedDragAndDrop;