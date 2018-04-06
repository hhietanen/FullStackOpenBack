const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')


app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))


//Morganin apufunktio joka ottaa kopin välitetystä data-bodystä ja tekee siitä stringin
morgan.token('body', function getId (req) {	
	let palaute = JSON.stringify(req.body)
  return palaute
})

//tehtävä 3.7
//app.use(morgan('tiny'))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

//Apufunktio joka generoi numeron välillä 0-9999
const generateId = () => {
  const Id = Math.random()*10000
  let Idx = Math.floor(Id)
  return Idx 
}

// const formatPerson = (person) => {
//   return {
//     name: person.name,
//     number: person.number,
//     id: person._id
//   }
// }



//Hakee kaikki henkilöt
app.get('/api/people', (request, response) => {
  Person
    .find({})
    .then(people => {
      response.json(people.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})


//Tekee uuden henkilön
app.post('/api/people', (request, response) => {
  const body = request.body
  console.log(body)

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'information missing'})
  }

  const persona = {
    name: body.name,
    number: body.number
  }


  Person
    .find({name: body.name})
    .then(person => {      
      let duplicate = Person.format(person[0])
      return duplicate.id
    })
    .then(id => {
      //console.log(id)
    return Person.findByIdAndUpdate(id, persona, { new: true } )
    })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  })

  person
    .save()
    .then(savedPerson => {
      response.json(Person.format(savedPerson))
    })
    .catch(error => {
      console.log(error)
    })    
  })    
})





//Hakee henkilön ID perusteella
app.get('/api/people/:id', (request, response) => {
  //Tämä oli käytössä ennen tehtävää 3:13
  // const id = Number(request.params.id)
  // const person = Person.find(person => person.id === id)
  // if ( person ) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }

  Person
    .findById(request.params.id)
    .then(person => {
      response.json(Person.format(person))
    })
   .catch(error => {
      console.log(error)
    })
})



//Tuhoaa henkilön
app.delete('/api/people/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(person => {
      console.log('Deleted', person)
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

    
//Näyttää info-sivulla yhteenvedon henkilöiden määrästä
app.get('/info', (request, response) => {
  response.end(
  	`<div>Puhelinluettelossa on ${Person.length} henkil&ouml;n tiedot</div>` +
  	`<div>${new Date()}</div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})