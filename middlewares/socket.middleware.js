const { authConstants } = require('../constants/auth.constants');
const { verifyJWT } = require('../utils/auth.utils');

// This middleware is used to check if the user is authenticated
// and if it is, it adds the user id to the socket object
const authMiddleware = (socket, next) => {
  const jwtToken = socket.request.cookies[authConstants.JWT_COOKIE_NAME];

  try {
    const userID = verifyJWT(jwtToken);
    socket.userID = userID;
    next();
  } catch (e) {
    console.log(e);
    next(new Error('Authentication error'));
  }
};

module.exports = {
  authMiddleware,
};
