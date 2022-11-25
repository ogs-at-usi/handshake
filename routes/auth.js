const express = require('express');
const { comparePassword } = require('../utils/auth.utils');
const {
  generateJWT,
  generateRefreshJWT,
  REFRESH_TOKEN_COOKIE,
  JWT_TOKEN_COOKIE,
  refreshJWT,
} = require('../utils/jwt.utils');
const constants = require('../constants/auth.constants');
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

  res
    .cookie(constants.JWT_COOKIE_NAME, token, JWT_TOKEN_COOKIE)
    .cookie(constants.REFRESH_COOKIE_NAME, refresh, REFRESH_TOKEN_COOKIE)
    .status(200)
    .json({
      message: 'Login successful',
    });
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies[constants.REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({
      message: 'Refresh token is required',
    });
  }

  try {
    const { token, refresh } = refreshJWT(refreshToken);
    res
      .cookie(constants.JWT_COOKIE_NAME, token, JWT_TOKEN_COOKIE)
      .cookie(constants.REFRESH_COOKIE_NAME, refresh, REFRESH_TOKEN_COOKIE)
      .status(200)
      .json({
        message: 'Refresh successful',
      });
  } catch (e) {
    return res.status(401).json({
      message: 'Invalid refresh token',
    });
  }
});

router.post('/logout', (req, res) => {
  const refreshToken = req.cookies[constants.REFRESH_COOKIE_NAME];
  if (refreshToken) {
    // TODO - delete the refresh token from the database
    // await deleteRefreshToken(refreshToken);
  }
  res
    .clearCookie('token', JWT_TOKEN_COOKIE)
    .clearCookie('refresh', REFRESH_TOKEN_COOKIE)
    .status(200)
    .json({
      message: 'Logout successful',
    });
});

router.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({
      message: 'Email, username and password are required',
    });
  }

  // Create user in the db
  // const user = await createUser(email, username, password)

  res.status(201).json({
    message: 'User created successfully',
  });
});

module.exports = router;
