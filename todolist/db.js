const mongoose = require('mongoose')
const {
  DBUSER: user,
  DBPASS: password 
} = process.env

mongoose.Promise = Promise 
mongoose.set('debug', true)
mongoose.connect(`mongodb://${user}:${password}@ds125125.mlab.com:25125/todolist`, { 
  useNewUrlParser: true,
  useCreateIndex: true
}) 
mongoose.connection.on('error', console.error)

mongoose.connection.on('connected', () => console.log('Conntected to database'))

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection closed through app termination')
    process.exit(0)
  })
})

module.exports = mongoose