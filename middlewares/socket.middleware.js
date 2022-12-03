const { authConstants } = require('../constants/auth.constants');
const { verifyJWT } = require('../utils/auth.utils');

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
