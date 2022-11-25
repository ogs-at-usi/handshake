const express = require('express');
const { comparePassword } = require('../utils/auth.utils');
const { generateJWT, generateRefreshJWT, REFRESH_TOKEN_COOKIE, JWT_TOKEN_COOKIE } = require('../utils/jwt.utils');
const router = express.Router();

router.post('/login', (req, res) => {
  // retrieve username and password from request
  // username could be either the username or email
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required',
    });
  }

  // const user = await getUser(username);
  // original password: "password"
  const user = {
    _id: 'eskere',
    email: 'test@gmail.com',
    username: 'test',
    password: '$2b$08$x3b7JL1o1c1QEsl5B5La6.aDDUGPBK9LKpLhkxPZkvNFoZ.RpYKU6',
  };
  if (!user) {
    return res.status(401).json({
      message: 'Wrong username or password',
    });
  }

  const validPassword = comparePassword(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      message: 'Wrong username or password',
    });
  }

  // the user exists and the password is valid
  // generate a JWT token and send it back to the user

  const token = generateJWT(user._id);
  const refresh = generateRefreshJWT(user._id);
  // return the response with a HTTP only cookie JWT and a HTTP only cookie refresh
  res
    .cookie('token', token, JWT_TOKEN_COOKIE)
    .cookie('refresh', refresh, REFRESH_TOKEN_COOKIE)
    .status(200)
    .json({
      message: 'Login successful',
    });
});

module.exports = router;