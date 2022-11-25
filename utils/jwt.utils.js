const jwt = require('jsonwebtoken');
const constants = require('../constants/auth.constants');

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

function generateJWT(userID) {
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: constants.JWT_MAX_AGE / 1000,
  });
}

async function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function generateRefreshJWT(userID) {
  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_SECRET, {
    expiresIn: constants.REFRESH_MAX_AGE / 1000,
  });

  const refresh = {
    userID,
    refreshToken,
  };

  // TODO - update the database with the refresh token
  // await saveRefreshToken(refresh);
  console.log(refresh);

  return refreshToken;
}

function verifyRefreshJWT(refreshToken) {
  return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
}

function refreshJWT(refreshToken) {
  const userID = verifyRefreshJWT(refreshToken);

  // TODO check in the database if the user's refresh token is the one we have
  const dbRefreshToken = refreshToken; // await getRefreshToken(userID);
  if (dbRefreshToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }

  const token = generateJWT(userID);
  const refresh = generateRefreshJWT(userID);
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
