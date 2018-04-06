const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv[3]){
  const person = new Person({
    name: process.argv[2],
    number : process.argv[3]
  })
  person
    .save()
    .then(response => {
      console.log('person saved!')
      mongoose.connection.close()
    })
}

else{
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo')
      result.forEach(person => {
        console.log(person.name, ' ', person.number)
      })
      mongoose.connection.close()
    })
}