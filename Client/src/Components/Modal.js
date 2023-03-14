import { useState } from 'react'
// import { useCookies } from 'react-cookie'


const Modal = ({ mode, setShowModal, getData, task }) => {
  // const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const editMode = mode === 'edit'

  const [data, setData] = useState({
    user_email: 'vedant@test.com',
    title: editMode ? task.title : null,
    date: editMode ? task.date : null,
  })

  const postData = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.status === 200) {
        setShowModal(null)
        getData()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const editData = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.status === 200) {
        setShowModal(null)
        getData()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((data) => ({
      ...data,
      [name]: value,
      date: new Date(),
    }))
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(null)}>X</button>
        </div>
        <form>
          <input
            required
            maxLength={30}
            placeholder=" Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          ></input>
          
          <input
            className={mode}
            type="submit"
            onClick={editMode ? editData : postData}
          ></input>
        </form>
      </div>
    </div>
  )
}

export default Modal
