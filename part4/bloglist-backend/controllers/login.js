const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // 1. Check if the user exists in the database
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // 2. Define the payload for the JWT token
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // 3. Sign the token using your SECRET key from .env
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60 * 60 } // Token expires in 1 hour
  )

  // 4. Send back the token and user details
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter