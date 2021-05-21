const verifyIdToken = require("../utils/verifyIdToken");
const generateIdToken = require("../utils/generateIdToken");
const createError = require("http-errors");

const User = require("../models/User");
const { ID_TOKEN_COOKIE_MAX_AGE } = require("../constants/constants");


const authenticateUser = async (req, res, next) => {
  const { empathyForLifeIdToken } = req.cookies;
  try {
    const { id, exp } = verifyIdToken(empathyForLifeIdToken);
    const oneHour = 60 * 60 * 1000;
    const willBeExpiredInHour = Date.now() - oneHour <= exp;

    if (await User.exists({ _id: id })) {
      res.locals.userId = id;

      if (willBeExpiredInHour) {
        const idToken = generateIdToken({ id });
        res.cookie(
          "empathyForLifeIdToken",
          idToken,
          { maxAge: ID_TOKEN_COOKIE_MAX_AGE },
        );
      }

      next();
    } else {
      res.clearCookie("empathyForLifeIdToken");
      throw new Error("not existed user");
    }
  } catch (err) {
    next(
      createError(403, "invalid id token", { error: err }),
    );
  }

};

module.exports = {
  authenticateUser,
};