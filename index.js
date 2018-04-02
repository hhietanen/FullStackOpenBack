const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

let persons = [
{
name: "Arto Hellas",
number: "040-123456",
id: 1
},
{
name: "Martti Tienari",
number: "040-123456666",
id: 2
},
{
name: "Arto Järvinen",
number: "040-1234567778888",
id: 3
},
{
name: "Lea Kutvonen",
number: "040-123456",
id: 4
}
]

app.use(bodyParser.json())

morgan.token('body', function getId (req) {	
	let stringeri = JSON.stringify(req.body)
  return stringeri
})

//tehtävä 3.7
//app.use(morgan('tiny'))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

//Generoi henkilölle random ID:n välillä 0-9999
const generateId = () => {
  const Id = Math.random()*10000
  let Idx = Math.floor(Id)
  return Idx 
}

//Tekee uuden henkilön
app.post('/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'information missing'})
  }


  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({error: 'Double content'})
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get('/persons', (request, response) => {
  response.json(persons)
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
response.end(
	`<div>Puhelinluettelossa on ${persons.length} henkilön tiedot</div>` +
	`<div>${new Date()}</div>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})