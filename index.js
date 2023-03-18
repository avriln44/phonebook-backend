const { request } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

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


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/info', (request, response) => {
    const len = persons.length
    const date = new Date();
    console.log(date);
    const html_to_return = `<p>Phonebook has info for ${len} people</p><p> ${date}</p>`
    return response.send(html_to_return);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === +id);
    if (person) { response.json(person) }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;


    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    }
    const listName = persons.map(pers => pers.name)
    if (listName.includes(person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
