const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Schema = mongoose.Schema
const peopleSchema = new Schema({
  name: String,
  number: String
})

peopleSchema.statics.format = function(person, cb){
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}


const People = mongoose.model('Person', peopleSchema)


module.exports = People