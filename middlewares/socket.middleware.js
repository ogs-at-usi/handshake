const { verifyJWT } = require('../utils/jwt.utils');
const cookie = require('cookie');
const authConstants = require('../constants/auth.constants');

// This middleware is used to check if the user is authenticated
// and if it is, it adds the user id to the socket object
const authMiddleware = async (socket, next) => {
  const jwtCookieName = authConstants.JWT_COOKIE_NAME;
  try {
    const cookies = cookie.parse(socket.request.headers.cookie);
    const jwtToken = cookies[jwtCookieName];
    if (!jwtToken) {
      return next(new Error('Authentication error'));
    }
    const { userId } = await verifyJWT(jwtToken);
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
