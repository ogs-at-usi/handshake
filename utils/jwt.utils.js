const jwt = require('jsonwebtoken');

const JWT_TOKEN_COOKIE = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  // expires in 5 minutes
  maxAge: 5 * 60 * 1000,
};

const REFRESH_TOKEN_COOKIE = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


function generateJWT(userID) {
  return jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '5m' });
}

async function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function generateRefreshJWT(userID) {}

module.exports = {
  JWT_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  generateJWT,
  verifyJWT,
  generateRefreshJWT,
};
