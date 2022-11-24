const jwt = require("jsonwebtoken");

function generateJWT(userID) {
  return jwt.sign({userID}, process.env.JWT_SECRET, { expiresIn: "5m" });
}

function verifyJWT(token, callback) {
  return jwt.verify(token, process.env.JWT_SECRET, callback);
}

export { generateJWT, verifyJWT };