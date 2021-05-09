const AdminPassword = require("../../models/AdminPassword");
const cryptograph = require("../../utils/cryptograph");
const createError = require("http-errors");

const authAdmin = async (req, res, next) => {
  const { password } = req.body;
  let storedPassword, salt;

  if (!password) {
    return res.json({ result: null });
  }

  try {
    const {
      password: _password,
      salt: _salt,
    } = (await AdminPassword.find({}).lean())[0];
    storedPassword = _password;
    salt = _salt;
  } catch (err) {
    return next(
      createError(500, "Internal Server error", { error: err })
    );
  }

  try {
    const { cryptoPassword } = cryptograph(password, salt);

    if (storedPassword === cryptoPassword) {
      return res.json({ result: "ok" });
    }

    return res.json({ result: null });
  } catch (err) {
    next(createError(
      500,
      "failed to authenticate an admin",
      { error: err },
    ));
  }
}

exports.authAdmin = authAdmin;
