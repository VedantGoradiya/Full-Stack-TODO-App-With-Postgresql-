const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

app.use(cors())
app.use(express.json())

//all
app.get('/todos/:userEmail', async (req, res) => {
  const { userEmail } = req.params
  try {
    const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
    res.json(todos.rows)
  } catch (error) {
    console.error(error)
  }
})

//create
app.post('/todos', async (req, res) => {
  try {
    const { user_email, title, date } = req.body
    const newToDo = await pool.query(
      `INSERT INTO todos (user_email, title, date) VALUES($1, $2, $3)`,
      [user_email, title, date]
    )
    res.json(newToDo)
  } catch (error) {
    console.error(error)
  }
})

//update
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const { user_email, title, date } = req.body
  try {
    const editToDo = await pool.query(
      'UPDATE todos SET user_email =$1, title = $2, date = $3 WHERE id = $4;',
      [user_email, title, date, id]
    )
    res.json(editToDo)
  } catch (error) {
    console.error(error)
  }
})

// delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
    res.json(deleteToDo)
  } catch (error) {
    console.error(error)
  }
})

app.post('/signup', async (req, res) => {
  try {
      const { email, password } = req.body

    console.log('PASSWORD',password)
    
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

      const signUp = await pool.query(
        `INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
        [email, hashedPassword]
      )
    
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' })
    
    res.json({ email, token })
    const error = signUp.name === 'error'
    
    if (!error) {
      res.json({ email, token })
  } else {
      res.json({ detail: signUp.detail})
  }
  

  } catch (error) {
    res.json(error)
    console.error(error)
  }
})


//login
app.post('/login', async (req,res) => {
  try {
      const { email, password } = req.body
      const users = await pool.query('SELECT * FROM users WHERE email = $1;', [email])
    
      if (!users.rows.length) return res.json({ detail: 'User does not exist'})

      const success = await bcrypt.compare(password, users.rows[0].hashed_password)
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' })

      if (success) {
          res.json({ "email" : users.rows[0].email , token })
      } else {
          res.json({ detail: 'Login failed'})
      }


  } catch (error) {
      console.error(error)
  }
})



app.listen(8000)