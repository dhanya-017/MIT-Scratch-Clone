import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import './styles.css';
import { Draggable } from "react-beautiful-dnd";
import { CATEGORIES } from "../constants";

export const SingleAction = (props) => {
  const { move, moves, setMoves, index, disableDelete=false, refresh} = props;

  const handleDelete = (idx) => {
    let active = moves;
    active.splice(idx, 1);
    let arr = [];
    setMoves(arr.concat(active));
    // Call refresh to reset all states and positions
    if (refresh) {
      refresh();
    }
  };

  return (
    <div>  
    {disableDelete ?
      <Draggable key={move.id} draggableId={move.id.toString()} index={index}>
          {(provided) => (
                <div 
                    className="moves__single" 
                    {...provided.draggableProps}    
                    {...provided.dragHandleProps} 
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: CATEGORIES[move.category],
                      ...provided.draggableProps.style
                    }}
                >
                  <span className="moves__single--text">{move.todo}</span>
                </div>
              )}
      </Draggable>
      : 
        <div 
          className="moves__single"
          style={{
            backgroundColor: CATEGORIES[move.category]
          }}
        >
            <span className="moves__single--text">{move.todo}</span>
            <div>
              <span className="icon" onClick={() => handleDelete(index)}>
                  <DeleteIcon sx={{":hover":{cursor:'pointer'}}} />
              </span>
            </div>  
        </div>
      }
    </div>
  );
};

export default SingleAction;