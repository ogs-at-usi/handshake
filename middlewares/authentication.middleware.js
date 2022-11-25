const {verifyJWT} = require('../utils/jwt.utils');

const authenticate = (req, res, next) => {
  const token = req.headers?.authorization || req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    req.user_id = verifyJWT(token);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticate;