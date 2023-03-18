import { React, useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import "../styles/KanbanContext.css";
import board from "./board";
import { nanoid } from "nanoid";
import DateInfo from "./DateInfo";
import Swal from "sweetalert2";
import Header from "./Header";
import DragNDropContext from "./DragNDropContext";

function Kanban() {
  const boardModel = board;
  const addTaskInput = useRef();
  const date = DateInfo();
  const editInput = useRef("");
  const [columns, setColumns] = useState(boardModel);
  const [newTaskValue, newValue] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [delModalIsOpen, setDelModalIsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState();
  const [editValue, setEdit] = useState("");
  const [cardToEdit, setCardToEdit] = useState([]);

  const saveData = (data) => {
    const tasksJSON = JSON.stringify(data);
    localStorage.setItem("tasks", tasksJSON);
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const convertedSavedTasks = JSON.parse(savedTasks);
      setColumns(convertedSavedTasks);
    }
  }, []);

  const addNewTask = (e) => {
    e.preventDefault();
    if (!newTaskValue) return;

    const newColumn = columns.map((column) => {
      if (column.id === "1") {
        const newCards = [
          ...column.cards,
          { id: nanoid(8), task: newTaskValue, date: date },
        ];
        return { ...column, cards: newCards };
      }
      return column;
    });
    setColumns(newColumn);
    saveData(newColumn);
    newValue("");
    addTaskInput.current.value = "";
  };

  const setEditValue = ({ target }) => {
    setEdit(target.value);
  };

  const setNewTaskValue = (e) => {
    e.preventDefault();
    newValue(e.target.value);
  };

  const onDragEnd = (card) => {
    const { source, destination, draggableId } = card;
    if (!destination) return;

    let sourceColumn = columns.filter(
      (column) => column.id === source.droppableId
    );
    let destinationColumn = columns.filter(
      (column) => column.id === destination.droppableId
    );

    const sourceListCopy = sourceColumn
      .map((item) => item)
      .reduce((a, card) => card.cards, {});
    const destinationListCopy = destinationColumn
      .map((item) => item)
      .reduce((a, card) => card.cards, {});

    const filteredList = sourceListCopy.filter(
      (task) => task.id !== draggableId
    );
    const draggedItem = sourceListCopy
      .filter((task) => task.id === draggableId)
      .reduce((a, item) => item, {});

    if (destination.droppableId === source.droppableId) {
      sourceColumn = sourceColumn.reduce((a, targetObj) => targetObj, {});
      filteredList.splice(destination.index, 0, draggedItem);
      const sourceColumnCopy = { ...sourceColumn, cards: filteredList };

      const newColumn = columns.map((column) => {
        if (column.id === destination.droppableId) {
          return sourceColumnCopy;
        }
        return column;
      });
      setColumns(newColumn);
      saveData(newColumn);
    } else {
      sourceColumn = sourceColumn.reduce((a, targetObj) => targetObj, {});
      destinationColumn = destinationColumn.reduce(
        (a, targetObj) => targetObj,
        {}
      );

      filteredList.splice(source.index, -1);
      destinationListCopy.splice(destination.index, 0, draggedItem);
      const sourceColumnCopy = { ...sourceColumn, cards: filteredList };
      const destinationColumnCopy = {
        ...destinationColumn,
        cards: destinationListCopy,
      };

      const newColumn = columns.map((column) => {
        if (column.id === source.droppableId) {
          return sourceColumnCopy;
        } else if (column.id === destination.droppableId) {
          return destinationColumnCopy;
        }
        return column;
      });
      setColumns(newColumn);
      saveData(newColumn);
    }
    newValue("");
  };

  const doneEdit = () => {
    const [cardTask, containers] = cardToEdit;
    const containerID = containers.getAttribute("data-rbd-droppable-id");
    const targetID = cardTask.getAttribute("data-rbd-draggable-id");

    if (!editValue) {
      setIsOpen(false);
      return;
    }

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Edit sucessful",
      showConfirmButton: false,
      timer: 700,
    });
    const columnAfterEdit = columns.map((column) => {
      if (column.id === containerID) {
        column.cards.map((task) => {
          if (task.id === targetID) {
            task.task = editValue;
          }
        });
      }
      return column;
    });
    setColumns(columnAfterEdit);
    saveData(columnAfterEdit);
    editInput.value = "";
    setEdit("");
    setIsOpen(false);
  };

  const deleteTask = () => {
    const containerTargetDiv = deleteTarget.closest(".containers");
    const containerID = containerTargetDiv.getAttribute(
      "data-rbd-droppable-id"
    );
    const targetID = deleteTarget.getAttribute("data-rbd-draggable-id");

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
    saveData(columnAfterDelete);
    closeDelModal();
    setDeleteTarget("");
  };

  const openModal = ({ target }) => {
    const targetDiv = target.closest(".card-task");
    const containerTargetDiv = targetDiv.closest(".containers");
    setIsOpen(true);
    setCardToEdit([targetDiv, containerTargetDiv]);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openDelModal = ({ target }) => {
    const targetCard = target.closest(".card-task");
    setDeleteTarget(targetCard);
    setDelModalIsOpen(true);
  };

  const closeDelModal = () => {
    setDelModalIsOpen(false);
  };

  return (
    <div className="main-container">
      <Header
        setNewTaskValue={setNewTaskValue}
        addNewTask={addNewTask}
        inputField={addTaskInput}
      />
      <div className="container-wrapper">
        <DragNDropContext
          onDragEnd={onDragEnd}
          columns={columns}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          editInput={editInput}
          setEditValue={setEditValue}
          doneEdit={doneEdit}
          deleteTask={deleteTask}
          openModal={openModal}
          openDelModal={openDelModal}
          delModalIsOpen={delModalIsOpen}
          closeDelModal={closeDelModal}
        />
      </div>
      <div className="footer-line" />
    </div>
  );
}

export default Kanban;
Modal.setAppElement("#root");
