const { verifyJWT } = require('../utils/jwt.utils');
const constants = require('../constants/auth.constants');

const authenticate = async (req, res, next) => {
  const token =
    req.cookies[constants.JWT_COOKIE_NAME] ||
    req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.userId = (await verifyJWT(token)).userId;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { authenticate };
