import React from 'react'
import Modal from 'react-modal';


const EditModal = ({modalIsOpen, closeModal, editField, setEditValue, doneEdit}) => {
  return (
    <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    overlayClassName="modal-overlay"
    className="modal-content">
    <h2>Edit your task!</h2>
    <input ref={editField} onChange={setEditValue} placeholder="Edit your task" />
    <button className="cancel-edit" onClick={closeModal}>Cancel</button>
    <button onClick={doneEdit} className="done-edit">Done</button>
  </Modal>
  )
}

export default EditModal