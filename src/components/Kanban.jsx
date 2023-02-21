import { React, useState, useRef, useEffect } from "react";
import Modal from 'react-modal';
import "../styles/App.css";
import board from './Board'
import { nanoid } from "nanoid";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCalendarDays, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import DateInfo from "./DateInfo";
import Swal from 'sweetalert2'
import Header from "./Header";
import EditModal from "./EditModal";

function Kanban() {
  const boardModel = board;
  const inputField = useRef();
  const date = DateInfo()
  const editField = useRef("");
  const [columns, setColumns] = useState(boardModel);
  const [newTaskValue, newValue] = useState(""); // New task value on input field
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editValue, setEdit] = useState("")
  const [cardToEdit, setCardToEdit] = useState([])


  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const convertedSavedTasks = JSON.parse(savedTasks);
      setColumns(convertedSavedTasks)
    }
  }, []);

  const saveData = (data) => {
    const tasksJSON = JSON.stringify(data);
    localStorage.setItem("tasks", tasksJSON);
  }

  const addNewTask = (e) => {
    e.preventDefault(); 
    if(!newTaskValue) return

    const newColumn = columns.map(column => {
      if(column.id === '1'){
      const newCards = [...column.cards, { id: nanoid(8), task: newTaskValue, date: date}]
      return  { ...column, cards: newCards }
    }
    return column
  }) 
    setColumns(newColumn)
    saveData(newColumn);
    newValue("")
    inputField.current.value = "";
  };

  const setEditValue = ({target}) => {
    setEdit(target.value)
  }

  const setNewTaskValue = (e) => {
    e.preventDefault();
    newValue(e.target.value);
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
      setColumns(newColumn)
      saveData(newColumn);
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
      saveData(newColumn)
    }
    newValue("")
}

  const doneEdit = () =>{
    let [cardTask, containers] = cardToEdit
    const containerID = containers.getAttribute("data-rbd-droppable-id");
    const targetID = cardTask.getAttribute("data-rbd-draggable-id");
    if(!editValue){
      setIsOpen(false)
      return
    }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Edit sucessful',
        showConfirmButton: false,
        timer: 700
      })
      const columnAfterEdit = columns.map((column) => {
        if (column.id === containerID) {
          column.cards.map((task) => {
            if (task.id === targetID) {
              task.task = editValue
            }
          });
        }
        return column;
      }); 
      setColumns(columnAfterEdit);
      editField.value = ""
      setEdit("");
      setIsOpen(false);
      saveData(columnAfterEdit);
  }

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
    setColumns(columnAfterDelete)
    saveData(columnAfterDelete);
  } 

  const openModal = ({target}) => {
    const targetDiv = target.closest(".card-task");
    const containerTargetDiv = targetDiv.closest(".containers");
    setIsOpen(true);
    setCardToEdit([targetDiv, containerTargetDiv])
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="main-container">
      <Header
        setNewTaskValue={setNewTaskValue}
        addNewTask={addNewTask}
        inputField={inputField}
      />
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
                          isdragging={
                            snapshot.isDragging
                              ? snapshot.isDragging.toString()
                              : undefined
                          }
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
                              <EditModal
                                modalIsOpen={modalIsOpen}
                                closeModal={closeModal}
                                editField={editField}
                                setEditValue={setEditValue}
                                doneEdit={doneEdit}
                              />
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
      <div className="footer-line"></div>
    </div>
  );  
}

export default Kanban;
Modal.setAppElement("#root");
