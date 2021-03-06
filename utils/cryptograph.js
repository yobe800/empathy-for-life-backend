const crypto = require("crypto");

const cryptograph = (password, userSalt = null) => {
  const {
    CRYPTO_BUFFER_BYTE,
    CRYPTO_ENCTYPE,
    CRYPTO_ITERATION,
    CRYPTO_ALGORITHM,
    CRYPTO_TO_STRING_ENCTYPE,
  } = process.env;

  const salt
    = userSalt
      || crypto.randomBytes(Number(CRYPTO_BUFFER_BYTE)).toString(CRYPTO_ENCTYPE);

  const encryptedPassword = crypto.pbkdf2Sync(
    password,
    salt,
    Number(CRYPTO_ITERATION),
    Number(CRYPTO_BUFFER_BYTE),
    CRYPTO_ALGORITHM,
  ).toString(CRYPTO_TO_STRING_ENCTYPE);

  return { encryptedPassword, salt };
};

module.exports = cryptograph;
