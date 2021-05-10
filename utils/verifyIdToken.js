const jwt = require("jsonwebtoken");
const generateIdToken = require("./generateIdToken");

const verifyIdToken = (idToken) => {
  const secretKey = process.env.ID_TOKEN_SECRET_KEY;

  try {
    const { id } = jwt.verify(
      idToken,
      secretKey,
    );

    return id;
  } catch (err) {
    throw err;
  }
};

module.exports = verifyIdToken;
