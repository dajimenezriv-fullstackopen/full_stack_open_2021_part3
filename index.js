// Heroku
// dajimenezriv@gmail.com
// dibujante1_

const express = require('express')
const app = express()
const bp = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
//app.use(requestLogger)
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    (Object.keys(req.body).length === 0) ? '' : JSON.stringify(req.body)
  ].join(' ')
}))
app.use(cors())

const PORT = process.env.PORT || 3001
const MAX_ID = 10000000

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Persons API</h1>')
})

app.get('/info', (request, response) => {
  let html = `<p>Phonebook has info for ${persons.length} people</p>`
  html += new Date()
  html += ``
  response.send(html)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) response.json(person)
  else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body)
    return response.status(400).json({
      error: 'content missing'
    })

  if (!body.name)
    return response.status(400).json({
      error: 'body must contain name'
    })

  if (!body.number)
    return response.status(400).json({
      error: 'body must contain number'
    })

  if (persons.find(person => person.name === body.name))
    return response.status(400).json({
      error: 'name must be unique'
    })

  const person = {
    ...body,
    id: Math.floor(Math.random() * MAX_ID)
  }

  persons = persons.concat(person)

  response.json(person)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})