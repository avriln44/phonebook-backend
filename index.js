const { request } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(express.static('build'))
require('dotenv').config()
const Person = require('./models/phonebook')


app.get('/api/persons', async (request, response, next) => {
    await Person.find({})
    .then(persons=>{
    response.json(persons)})
    .catch(error=>next(error))
})

app.get('/api/persons/info', async(request, response,next) => {
    await Person.find({})
    .then(persons=>{
    const len=persons.length
    console.log(len)
    const date = new Date();
    console.log(date);
    const html_to_return = `<p>Phonebook has info for ${len} people</p><p> ${date}</p>`
    return response.send(html_to_return)
    })
    .catch(error=>next(error))
})

app.get('/api/persons/:id', async (request, response,next) => {
    await Person.findById(request.params.id)
    .then(person=>{
    if (person) { 
        response.json(person) }
    else {
        response.status(404).end()
    }})
    .catch(error=>next(error))
})

app.delete('/api/persons/:id', async (request, response, next) => {
    // const id = Number(request.params.id)
    await Person.findByIdAndRemove(request.params.id)
    .then(result=>{
        response.status(204).end()
    })
    .catch(error=>next(error))
})

app.post('/api/persons', async (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    const person = new Person ({
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    })
    // const listName = persons.map(pers => pers.name)
    // if (listName.includes(person.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    // persons = persons.concat(person)

    // response.json(person)
    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
      })
    .catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next)=>{
    console.log("dsd")
    const body=request.body
    const person={
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number,
    }
    
    Person.findByIdAndUpdate(request.params.id,person)
    .then(updatedPerson => {
        console.log("wtf")
        response.json(updatedPerson)
    })
    .catch(error=>next(error))
})

function errorHandler(error, req, res, next) {
    console.error(error.stack); // Log the error stack trace to the console for debugging
    res.status(500).json({ error: 'An internal server error occurred' }); // Send a 500 Internal Server Error response with a JSON message
  }

app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
