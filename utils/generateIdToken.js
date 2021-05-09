const jwt = require("jsonwebtoken");

const generateIdToken = (value = {}, exp = 86400 ) => {
  let expiresIn = exp;

  if (!Number.isSafeInteger(expiresIn) && expiresIn <= 0) {
    expiresIn = 86400;
  }

  const secretKey = process.env.ID_TOKEN_SECRET_KEY;

  return jwt.sign(
    value,
    secretKey,
    { expiresIn },
  );
};

module.exports = generateIdToken;
