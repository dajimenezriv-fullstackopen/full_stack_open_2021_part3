// only for testing that a person is saved in mongodb
// node mongo.js <Password>
// node mongo.js <Password> <Name> <Number>
// node mongo.js yourpassword
// node mongo.js yourpassword "Arto Vihavainen" 045-1232456

require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <Password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://dajimenezriv:${password}@cluster0.zdudq.mongodb.net/persons?retryWrites=true&w=majority`
mongoose.connect(url)

const Person = mongoose.model('Person', new mongoose.Schema({
  'name': String,
  'number': String
}))

if (process.argv.length == 3) {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length == 5) {
  const person = new Person({
    'name': process.argv[3],
    'number': process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
