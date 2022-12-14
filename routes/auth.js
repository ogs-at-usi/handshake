const express = require('express');
const { comparePassword, hashPassword } = require('../utils/auth.utils');
const {
  generateJWT,
  generateRefreshJWT,
  REFRESH_TOKEN_COOKIE,
  JWT_TOKEN_COOKIE,
  refreshJWT,
} = require('../utils/jwt.utils');
const constants = require('../constants/auth.constants');
const { User } = require('../models/user');
const { RefreshToken } = require('../models/refreshToken');
const router = express.Router();

router.post('/login', async (req, res) => {
  // retrieve username and password from request
  // username could be either the username or email
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required',
    });
  }

  // get the user that has username = username or email = username
  const user = await User.findOne({
    $or: [{ name: username }, { email: username }],
  }).exec();

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
  const refresh = await generateRefreshJWT(user._id);

  res
    .cookie(constants.JWT_COOKIE_NAME, token, JWT_TOKEN_COOKIE)
    .cookie(constants.REFRESH_COOKIE_NAME, refresh, REFRESH_TOKEN_COOKIE)
    .status(200)
    .json({
      message: 'Login successful',
      user,
    });
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies[constants.REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({
      message: 'Refresh token is required',
    });
  }

  try {
    const { token, refresh } = await refreshJWT(refreshToken);
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

router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies[constants.REFRESH_COOKIE_NAME];
  if (refreshToken) {
    // delete refresh token from database
    try {
      await RefreshToken.findOneAndDelete({ token: refreshToken }).exec();
    } catch (e) {}
  }
  res
    .clearCookie(constants.JWT_COOKIE_NAME, { httpOnly: true })
    .clearCookie(constants.REFRESH_COOKIE_NAME, { httpOnly: true })
    .status(200)
    .json({
      message: 'Logout successful',
    });
});

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({
      password: 'Email, username and password are required',
      message: 'Email, username and password are required',
    });
  }

  try {
    const user = await User.create({
      email,
      name: username,
      password: hashPassword(password),
    });

    if (!user) {
      return res.status(400).json({
        username: 'Something went wrong',
        message: 'Something went wrong',
      });
    }

    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (e) {
    return res.status(400).json({
      email: 'Username or email already taken',
      message: 'Username or email already taken',
    });
  }
});

module.exports = router;
