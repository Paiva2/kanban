import React from "react";
import Modal from "react-modal";
import "../styles/DeleteModal.css";

const DeleteModal = ({ delModalIsOpen, closeDelModal, deleteTask }) => {
  return (
    <Modal
      isOpen={delModalIsOpen}
      onRequestClose={closeDelModal}
      overlayClassName="modal-overlay-delete"
      className="del-modal-content"
    >
      <h2>Are you sure?</h2>
      <p>This is not reversible!</p>
      <hr />
      <div className="buttons">
        <button onClick={deleteTask} className="confirm-delete">
          Confirm
        </button>
        <button className="cancel-delete" onClick={closeDelModal}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
