const { timeStamp } = require('console')
//Importing Mongoose
const mongoose = require('mongoose')

//User Schema
const userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: [true]
  },
  lname: {
    type: String,
    required: [true]
  },
  email: {
    type: String,
    required: [true],
    unique: true
  },
  password: {
    type: String,
    required: [true],
  },
  red_num: {
    type: String,
    required: [true]
  },
  branch: {
    type: String,
    required: [true]
  },
  number: {
    type: Number,
    required: [true]
  },
},
  {
    timeStamps: true,
  })

//Exporting userModel
module.exports = mongoose.model('User', userSchema)