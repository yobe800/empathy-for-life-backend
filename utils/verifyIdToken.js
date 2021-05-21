const jwt = require("jsonwebtoken");

const verifyIdToken = (idToken) => {
  const secretKey = process.env.ID_TOKEN_SECRET_KEY;

  try {
    return jwt.verify(
      idToken,
      secretKey,
    );
  } catch (err) {
    throw err;
  }
};

module.exports = verifyIdToken;
