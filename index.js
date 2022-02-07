// BACKEND

// Heroku
// dajimenezriv@gmail.com
// <password>1_
// https://dashboard.heroku.com/apps/full-stack-open-2021/deploy/heroku-git
// https://full-stack-open-2021.herokuapp.com/
// https://full-stack-open-2021.herokuapp.com/api/persons

// MongoDB (google account)
// dajimenezriv // <password>

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const bp = require('body-parser')
const Person = require('./models/persons')
const PORT = process.env.PORT

// CUSTOM MIDDLEWARE

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name == 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
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
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Persons API</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><br>${new Date()}`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person)
        response.json(person)
      else
        response.status(404).end()
    })
    // the object does not exist
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
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

  Person.findByIdAndUpdate(request.params.id, {...body})
    .then(person => {
      console.log(person)
      response.json(person)
    })
    .catch(error => next(error))
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

  Person.find({}).then(persons => {
    if (persons.find(person => person.name === body.name))
      return response.status(400).json({
        error: 'name must be unique'
      })
    else
      new Person({ ...body }).save().then(savedPerson => response.json(savedPerson))
  })
})

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
