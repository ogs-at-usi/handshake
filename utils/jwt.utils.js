const jwt = require('jsonwebtoken');
const constants = require('../constants/auth.constants');
const { RefreshToken } = require('../models/refreshToken');
const { ObjectId } = require('mongodb');

const JWT_TOKEN_COOKIE = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  // expires in 5 minutes
  maxAge: constants.JWT_MAX_AGE,
};

const REFRESH_TOKEN_COOKIE = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: constants.REFRESH_MAX_AGE,
};

function generateJWT(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: constants.JWT_MAX_AGE / 1000,
  });
}

async function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function generateRefreshJWT(userId) {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: constants.REFRESH_MAX_AGE / 1000,
  });

  await RefreshToken.findOneAndUpdate(
    { user: ObjectId(userId) },
    { user: ObjectId(userId), token: refreshToken },
    { upsert: true, new: true }
  ).exec();

  return refreshToken;
}

function verifyRefreshJWT(refreshToken) {
  return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
}

async function refreshJWT(refreshToken) {
  const { userId } = verifyRefreshJWT(refreshToken);

  const dbRefreshToken = await RefreshToken.findOne({
    user: new ObjectId(userId),
  }).exec();
  if (
    !dbRefreshToken ||
    dbRefreshToken.token !== refreshToken ||
    dbRefreshToken.expiresAt < Date.now()
  ) {
    throw new Error('Invalid refresh token');
  }

  const token = generateJWT(userId);
  const refresh = await generateRefreshJWT(userId);
  return { token, refresh };
}

module.exports = {
  JWT_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  generateJWT,
  verifyJWT,
  generateRefreshJWT,
  verifyRefreshJWT,
  refreshJWT,
};
