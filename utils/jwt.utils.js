const jwt = require("jsonwebtoken");

function generateJWT(userID) {
  return jwt.sign({userID}, process.env.JWT_SECRET, { expiresIn: "5m" });
}

async function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

module.exports = {
  generateJWT,
  verifyJWT
}