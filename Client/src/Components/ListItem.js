import { useState } from 'react'
import ShowModal from './Modal'


const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(null)

  const deleteItem = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, {
        method: 'DELETE',
      })
      if (response.status === 200) {
        getData()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <li className="list-item">
      <div className="info-container">
        
        <p className="task-title">{task.title}</p>
        
      </div>
      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          EDIT
        </button>
        <button className="delete" onClick={deleteItem}>
          DELETE
        </button>
      </div>
      {showModal && (
        <ShowModal
          mode={'edit'}
          setShowModal={setShowModal}
          getData={getData}
          task={task}
        />
      )}
    </li>
  )
}

export default ListItem
