import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import EditModal from "./EditModal";
import "../styles/DragNDropContext.css";
import DeleteModal from "./DeleteModal";

const DragNDropContext = ({
  onDragEnd,
  columns,
  modalIsOpen,
  closeModal,
  editInput,
  setEditValue,
  doneEdit,
  deleteTask,
  openModal,
  openDelModal,
  delModalIsOpen,
  closeDelModal,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {columns.map((item, index) => (
        <Droppable droppableId={item.id} key={index}>
          {(provider, snapshot) => (
            <div
              className={
                snapshot.isDraggingOver ? "dragging-over-column" : "containers"
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
                        snapshot.isDragging ? "card-task-dragging" : "card-task"
                      }
                      ref={provider.innerRef}
                      {...provider.draggableProps}
                      {...provider.dragHandleProps}
                    >
                      <DeleteModal
                        delModalIsOpen={delModalIsOpen}
                        closeDelModal={closeDelModal}
                        deleteTask={deleteTask}
                      />
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
                          snapshot.isDragging ? "actions-dragging" : "actions"
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
                            editInput={editInput}
                            setEditValue={setEditValue}
                            doneEdit={doneEdit}
                          />
                          <button onClick={openDelModal} className="del-btn">
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
  );
};

export default DragNDropContext;
