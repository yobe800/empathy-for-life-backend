const jwt = require("jsonwebtoken");
const generateIdToken = require("./generateIdToken");

const verifyIdToken = (idToken) => {
  const secretKey = process.env.ID_TOKEN_SECRET_KEY;

  try {
    const { name, email } = jwt.verify(
      idToken,
      secretKey,
    );

    return generateIdToken({ name, email });
  } catch (err) {
    throw err;
  }
};

module.exports = verifyIdToken;
