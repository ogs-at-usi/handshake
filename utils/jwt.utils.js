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

function generateRefreshJWT(userID) {
  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_SECRET, {
    expiresIn: '7d',
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
