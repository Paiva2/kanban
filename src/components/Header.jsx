import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


const Header = ({setNewTaskValue, addNewTask, inputField}) => {
  return (
      <>
        <header className="header">KANBAN MODEL</header>
        <div className="add-task">
          <input
            className="input-field"
            onChange={(e) => setNewTaskValue(e)}
            placeholder="Add your new task"
            ref={inputField}
            type="text"
          />
          <button onClick={(e) => addNewTask(e)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </>
  )
}

export default Header