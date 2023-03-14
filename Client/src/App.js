import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import ListHeader from './Components/ListHeader'
import ListItem from './Components/ListItem'
import Auth from './Components/Auth'

function App() {
  const [tasks, setTasks] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const userEmail = 'vedant@test.com'
  const authToken = cookies.AuthToken
  // const userEmail = cookies.Email


  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${userEmail}`,)
      if (response.status === 200) {
        const json = await response.json()
        setTasks(json)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }
    , [])



  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))


  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <ListHeader listName={'Simple Todo Lists'} getData={getData} />
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      }
    </div>
  );
}

export default App;
