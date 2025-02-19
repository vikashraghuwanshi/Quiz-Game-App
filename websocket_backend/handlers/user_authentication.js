const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function authenticateWebSocket(token) {

  if (!token) {
    return { error: "No token provided!" };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return { user };
  } catch (err) {
    return { error: "Invalid token!" };
  }
}

module.exports = { authenticateWebSocket };
