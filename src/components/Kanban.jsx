import { React, useState, useRef } from "react";
import Modal from 'react-modal';
import "../styles/App.css";
import board from './Board'
import { nanoid } from "nanoid";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCalendarDays, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import DateInfo from "./DateInfo";
import Header from "./Header";
Modal.setAppElement("#root");

function Kanban() {
  const [newTaskValue, newValue] = useState(""); // New task value on input field
  const [modalIsOpen, setIsOpen] = useState(false);
  const inputField = useRef();
  const boardModel = board;
  const [columns, setColumns] = useState(boardModel);
  
  const addNewTask = (e) => {
    e.preventDefault();
    if(!newTaskValue) return

    const newColumn = columns.map(column => {
      if(column.id === '1'){
      const newCards = [...column.cards, { id: nanoid(8), task: newTaskValue, date: DateInfo()}]
      return  { ...column, cards: newCards }
    }
    return column
  }) 
    
    setColumns(newColumn)
    newValue("")
    inputField.current.value = "";
    inputField.current.focus();
  };

  const setNewTaskValue = ({ target }) => {
    newValue(target.value);
  };

  const onDragEnd = (card) => {
    const { source, destination, draggableId } = card;
    if (!destination) return;

    let sourceColumn = columns.filter((column) => column.id === source.droppableId);
    let destinationColumn = columns.filter((column) => column.id === destination.droppableId);
   
    const listCopySource = sourceColumn.map((item) => item).reduce((a, card) => card.cards, {});
    const listCopyDestination = destinationColumn.map((item) => item).reduce((a, card) => card.cards, {});

    const filteredList = listCopySource.filter((task) => task.id !== draggableId);
    const draggedItem = listCopySource.filter((task) => task.id === draggableId).reduce((a, item) => item, {});
    
    if(destination.droppableId === source.droppableId){

      sourceColumn = sourceColumn.reduce((a, targetObj) => targetObj, {})
      filteredList.splice(destination.index, 0, draggedItem);
      const sourceColumnCopy = { ...sourceColumn, cards: filteredList }

      const newColumn = columns.map(column => {
        if(column.id === destination.droppableId){
        return  sourceColumnCopy
        }
        return column
      })
      setColumns(newColumn);
    }else{
      sourceColumn = sourceColumn.reduce((a, targetObj) => targetObj, {})
      destinationColumn = destinationColumn.reduce((a, targetObj) => targetObj, {})

      filteredList.splice(source.index, -1);
      listCopyDestination.splice(destination.index, 0, draggedItem);
      const sourceColumnCopy = { ...sourceColumn, cards: filteredList }
      const destinationColumnCopy = { ...destinationColumn, cards: listCopyDestination }
 
      const newColumn = columns.map(column => {
        if(column.id === source.droppableId){
      return  sourceColumnCopy
        }else if(column.id === destination.droppableId){
      return  destinationColumnCopy
        }
        return column
      })
      
      setColumns(newColumn)
    }
    newValue("")
}

const openModal = () => {
  setIsOpen(true);
};

const closeModal = () => {
  setIsOpen(false);
};


const delTask = ({target}) =>{
  const targetDiv = target.closest(".card-task");
  const containerTargetDiv = targetDiv.closest(".containers");
  const containerID = containerTargetDiv.getAttribute("data-rbd-droppable-id");
  const targetID = targetDiv.getAttribute("data-rbd-draggable-id");

  const columnAfterDelete = columns.map((column) => {
    if (column.id === containerID) {
      column.cards.map((task, index) => {
        const containerCards = column.cards;
        if (task.id === targetID) {
          containerCards.splice(index, 1);
        }
      });
    }
    return column;
  });
  setColumns(columnAfterDelete);
}

  return (
    <div className="main-container">
      <Header />
      <div className="add-task">
        <input
          className="input-field"
          placeholder="Add your new task"
          ref={inputField}
          onChange={setNewTaskValue}
          type="text"
        />
        <button onClick={addNewTask}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="container-wrapper">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((item, index) => (
            <Droppable droppableId={item.id} key={index}>
              {(provider, snapshot) => (
                <div
                  className={
                    snapshot.isDraggingOver
                      ? "dragging-over-column"
                      : "containers"
                  }
                  ref={provider.innerRef}
                  {...provider.droppableProps}
                >
                  <div className="column-title">
                    <p>{item.title}</p>
                  </div>
                  {item.cards.map((card, cardIndex) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={cardIndex}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {(provider, snapshot) => (
                        <div
                          isDragging={snapshot.isDragging}
                          className={
                            snapshot.isDragging
                              ? "card-task-dragging"
                              : "card-task"
                          }
                          ref={provider.innerRef}
                          {...provider.draggableProps}
                          {...provider.dragHandleProps}
                        >
                          <div
                            className={
                              snapshot.isDragging
                                ? "text-task-dragging"
                                : "task-text"
                            }
                          >
                            <p>{card.task}</p>
                          </div>
                          <div
                            className={
                              snapshot.isDragging
                                ? "actions-dragging"
                                : "actions"
                            }
                          >
                            <div className="date-container">
                              <p>
                                <FontAwesomeIcon
                                  className={
                                    snapshot.isDragging
                                      ? "calendar-drag"
                                      : "calendar-icon"
                                  }
                                  icon={faCalendarDays}
                                />
                                {card.date}
                              </p>
                            </div>
                            <div className="del-edit">
                              <button onClick={openModal} className="edit-btn">
                                <FontAwesomeIcon icon={faEdit} />
                              </button>

                              <button onClick={delTask} className="del-btn">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provider.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>Edit your task!</h2>
        <hr />
        <input placeholder="Edit your task"></input>
        <button onClick={closeModal}>Close</button>
        <button>Ok</button>
      </Modal>
      <div className="footer-line"></div>
    </div>
  );
}

export default Kanban;
