const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
app.use(express.json())

const dbpath = path.join(__dirname, 'todoApplication.db')
let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Db error :${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

const hasPriorityAndstatus = requirequary => {
  retrun(
    requirequary.priority !== undefined && requestquary.status !== undefined,
  )
}
const hasPriority = requestquary => {
  return requestquary.priority !== undefined
}
const hasStatus = requestquary => {
  return requestquary.status !== undefined
}
app.get('/todos/', async (request, response) => {
  let getQuary = ''
  const {search_q = '', priority, status} = request.quary
  switch (true) {
    case hasPriorityAndstatus(request.quary):
      getQuary = `SELECT
    * FROM
    todo
    WHERE todo LIKE '%${search_q}%'
    AND priority = '${priority}'
    AND status = '${status}';`
      break
    case hasPriority(request.quary):
      getQuary = `SELECT
    * 
    FROM
    todo
    WHERE 
    todo LIKE '%${search_q}%'
    AND priority = '${priority}';`
      break
    case hasStatus(request.quary):
      getQuary = `SELECT 
    * FROM 
    todo
    WHERE
    todo LIKE '${search_q}'
    AND status = '${status}';`
      break
    default:
      getQuary = `
    SELECT
    *
    FROM
    todo LIKE '${search_q}';`
  }
  const data = await db.all(getQuary)
  response.send(data)
})
// api 2 get data from table todoId
app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const todo_id_Quary = `
  SELECT * FROM todo
  WHERE id = ${todoId};`
  const responseTodo = await db.all(todo_id_Quary)
  response.send(responseTodo)
})
// api 3 post new data to table
app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body
  const insert_data = `
  INSERT INTO todo(id,todo,priority,status)
  VALUES(${id},'${todo}','${priority}','${status}');`
  await db.run(insert_data)
  response.send('Todo Successfully Added')
})
// api 4 upadte todo,priority,status
app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  let updateCol = ''
  const requestBody = request.body
  switch (true) {
    case requestBody.status !== undefined:
      updateCol = 'Status'
      break
    case requestBody.priority !== undefined:
      updateCol = 'Priority'
      break
    case requestBody.todo !== undefined:
      updateCol = 'Todo'
      break
  }
  const previousdata = `
  SELECT * FROM todo 
  WHERE id = ${todoId};`
  const previousTodo = await db.run(previousdata)
  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
  } = request.body
  const updateToQuary = `UPDATE todo 
  SET
  todo = '${todo}',
  priority = '${priority}',
  status = '${status}'
  WHERE id = ${todoId};`
  await db.run(updateToQuary)
  response.send(`${updateCol} Updated`)
})
// api 5 delete data
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteQuary = `
  DELETE FROM todo
  WHERE id = ${todoId};
  `
  await db.run(deleteQuary)
  response.send('Todo Delete')
})
module.exports = app
