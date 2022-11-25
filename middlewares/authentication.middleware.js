const {verifyJWT} = require('../utils/jwt.utils');

const authenticate = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    req.userID = await verifyJWT(token);
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticate;