require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/Phonebook')



const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('req-data', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
  Phonebook
    .find({})
    .then(persons => response.json(persons))
    .catch(error => console.log(error))
})

app.get('/info', (request, response) => {
  const dateTimestamp = new Date()
  response.send('Phonebook has info for people' + '<br/><br/>' + dateTimestamp.toString())
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook
    .findById(request.params.id)
    .then(result => {
      response.send(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const person = request.body

  if (!person.name) {
    response.status(400).send({ error: 'must include name' }).end()
  }

  if (!person.number) {
    response.status(400).send({ error: 'must include number' }).end()
  }

  const newPerson = new Phonebook({ ...person })
  newPerson
    .save()
    .then(() => response.send(person))
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }   else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})