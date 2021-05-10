const createError = require("http-errors");

const cryptograph = require("../../utils/cryptograph");
const getRandomUserCharactor = require("../../utils/getRandomUserCharactor");
const AdminPassword = require("../../models/AdminPassword");
const User = require("../../models/User");

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

const signUpAdmin = async (req, res, next) => {
  try {
    let payload;
    const { id, password, userName, email } = req.body;
    const hasUndefined = Object
    .values(req.body)
    .some((value) => value === undefined);

    if (hasUndefined) {
      payload = { message: "there is undefined value" };
    } else if (await User.exists({ admin_id: id })) {
      payload = { message: "there is same admin ID" };
    } else {
      const { cryptoPassword, salt } = cryptograph(password);
      const form = {
        admin_id: id,
        admin_password: cryptoPassword,
        user_name: userName,
        email,
        is_administrator: true,
        salt,
        character: getRandomUserCharactor(),
      };

      const {
        admin_id,
        user_name,
        is_administrator,
        character,
        access_time,
      } = await User.create(form);

      payload = {
        admin_id,
        user_name,
        is_administrator,
        character,
        access_time
      };
    }

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to sign up an admin", { error: err })
    );
  }

}

exports.authAdmin = authAdmin;
exports.signUpAdmin = signUpAdmin;

