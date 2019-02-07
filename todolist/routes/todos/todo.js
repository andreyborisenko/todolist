const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Todo should have a title'
  },
  isDone: {
    type: Boolean,
    default: false
  },
  _ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Todo', todoSchema)