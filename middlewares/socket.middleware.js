const { verifyJWT } = require('../utils/jwt.utils');
const cookie = require('cookie');
const authConstants = require('../constants/auth.constants');

// This middleware is used to check if the user is authenticated
// and if it is, it adds the user id to the socket object
const authMiddleware = (socket, next) => {
  const jwtCookieName = authConstants.JWT_COOKIE_NAME;
  const cookies = cookie.parse(socket.request.headers.cookie);
  const jwtToken = cookies[jwtCookieName];
  try {
    const {userId}= verifyJWT(jwtToken);
    socket.userId = userId;
    next();
  } catch (e) {
    console.log(e);
    next(new Error('Authentication error'));
  }
};

module.exports = {
  authMiddleware,
};
