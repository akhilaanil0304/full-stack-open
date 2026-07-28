require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// 1. Static middleware to serve production frontend from the 'dist' folder
app.use(express.static('dist'))

// 2. Middleware to parse incoming JSON payloads
app.use(express.json())

// 3. Middleware for Cross-Origin Resource Sharing
app.use(cors())

// --- ROUTES ---

// GET: Info route
app.get('/info', (_req, res, next) => {
  Person.find({})
    .then(persons => {
      const infoText = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
      res.send(infoText)
    })
    .catch(error => next(error))
})

// GET: Fetch all persons
app.get('/api/persons', (_req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

// GET: Fetch a single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST: Add a new person
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

// DELETE: Remove a person by ID
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// --- ERROR HANDLING MIDDLEWARE ---

// Middleware for unknown endpoints
const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Centralized error handling middleware
const errorHandler = (error, _req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

// --- LISTEN ---

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})