//Importing Express-async-handler
const asyncHandler = require('express-async-handler')
//Importing JWT
const jwt = require('jsonwebtoken')
//Importing bcrypt
const bcrypt = require('bcrypt')
//Importing userModel
const User = require('../Models/userModel')



//REGISTER
// @desc POST USER
// POST /signup
// access PUBLIC
const signupUser = asyncHandler(async (req, res) => {

  //checking if any fields are left out
  if (!req.body.fname) {
    res.status(400)
    throw new Error('Enter your first name')
  }
  else if (!req.body.lname) {
    res.status(400)
    throw new Error('Enter your last name')
  }
  else if (!req.body.password) {
    res.status(400)
    throw new Error('Enter your password')
  }
  else if (!req.body.email) {
    res.status(400)
    throw new Error('Enter your email')
  }
  else if (!req.body.red_num) {
    res.status(400)
    throw new Error('Enter your registration number')
  }
  else if (!req.body.branch) {
    res.status(400)
    throw new Error('Enter your branch')
  }
  else if (!req.body.number) {
    res.status(400)
    throw new Error('Enter your mobile number')
  }

  //Checking if user exists
  const userExists = await User.findOne({ email: req.body.email })
  if (userExists) {
    res.status(400);
    throw new Error('User already exists')
  }

  //Hashing password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //Validating and inserting user data in DB
  if (req.body.fname && req.body.lname && req.body.email && req.body.password && req.body.red_num && req.body.branch && req.body.number) {
    const userData = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: hashPassword,
      red_num: req.body.red_num,
      branch: req.body.branch,
      number: req.body.number,
      createdAt: new Date()
    };

    //Inserting user in DB
    const user = await User.create(userData);

    if (user) {
        console.log(user + " User registerd");
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    else {
      res.status(400)
      throw new Error('Error')
    }
  }
})




//LOGIN
// @desc GET USER
// GET /login
// access PUBLIC
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    //Check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        console.log(user + " Logged in");
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    else{
        res.status(400)
        throw new Error('Error')
    }

})



//Me
// @desc ME USER
// GET /me
// access PRIVATE
const meUser = asyncHandler(async (req, res) => {
    const { _id, fname, lname, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        fname,
        lname,
        email,
    })
})



//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}



//Exporting userController
module.exports = {
  signupUser, loginUser, meUser
}
