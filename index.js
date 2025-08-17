const express = require('express')
const morgan = require('morgan')
const cors = require('cors')



const app = express()
app.use(cors())
app.use(express.json())

morgan.token('req-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'))

const getRandomInt = () => Math.floor(Math.random() * 1000);

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send("<h1>Hello World</h1>")
})

app.get('/api/persons', (request, response) => {
    response.send(phonebook)
})

app.get('/info', (request, response) => {
    const dateTimestamp = new Date()
    response.send(`Phonebook has info for ${phonebook.length} people` + '<br/><br/>' + dateTimestamp.toString())
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(p => p.id === id)

    if (person) {
        response.send(person)
    } else {
        response.status(404).end()
    }
 })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const newPhonebook = phonebook.filter((p) => p.id !== id)
    phonebook = newPhonebook

    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        response.status(400).send({error: 'must include name'}).end()
    }

    if (!person.number) {
        response.status(400).send({error: 'must include number'}).end()
    }

    const existingPerson = phonebook.filter(p => p.name === person.name)
    if (existingPerson.length > 0) {
        response.status(400).send({error: 'name must be unique'}).end()
        return
    }

    const id = getRandomInt()
    const newPerson = { ...person, id: String(id)}
    phonebook.push(newPerson)
    response.send(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})