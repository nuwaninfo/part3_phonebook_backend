require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('reqbody', function (request) {
  return Object.keys(request.body).length !== 0
    ? JSON.stringify(request.body)
    : null
})

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :reqbody')
)

app.get('/api/info', function (request, response, next) {
  Person.countDocuments()
    .then((count) => {
      const numOfPersons = `<p>Phonebook has info for ${count} people</p>`
      const currentDateTime = `<p>${new Date().toString()}</p>`
      response.send(numOfPersons + currentDateTime)
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => {
    response.json(result)
  })
})

// Get a singl person information
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send({ error: 'malformated id' })
    })
})

// Delete a person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// Add a person
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const personName = body.name

  if (!personName || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

// Update phone number
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malforamted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
