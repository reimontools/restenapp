import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useList from '../../hooks/useList';

export default function OrdenarHelp() {

    // LIST #########################################################################################################################################
    const playerList = useList('player');
    console.log("playerList", playerList);


    const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});



    return (
        <DragDropContext onDragEnd={(result) => console.log(result)}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                        {playerList.map((player, index) => (
                            <Draggable key={player.player_id} draggableId={player.player_fullname} index={player.player_id}>
                                {(provi, snapshot) => (
                                    <div {...provi.draggableProps} ref={provi.innerRef} {...provi.dragHandleProps} style={getItemStyle(
                                        snapshot.isDragging,
                                        provi.draggableProps.style
                                    )}>
                                        {player.player_id}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
      </DragDropContext>
    );
};