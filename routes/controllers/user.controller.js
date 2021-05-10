const createError = require("http-errors");

const User = require("../../models/User");

const { authenticateUser } = require("../../auth/firebase");
const { ID_TOKEN_COOKIE_MAX_AGE } = require("../../constants/constants");
const verifyIdToken = require("../../utils/verifyIdToken");
const getToken = require("../../utils/getToken");
const generateIdToken = require("../../utils/generateIdToken");
const getRandomUserCharactor = require("../../utils/getRandomUserCharactor");

const getUser = async (req, res, next) => {
  const { empathyForLifeIdToken } = req.cookies;
  const payload = { message: "", result: null };

  if (!empathyForLifeIdToken) {
    payload.message = "failed";
    return res.json(payload);
  }

  try {
    const userId = verifyIdToken(empathyForLifeIdToken);
    const projection = "user_name is_administrator character access_time";
    const user = await User.findById(userId, projection, { lean: true });

    payload.message = "ok";
    payload.result = user;

    const idToken = generateIdToken(
      { id: payload.result._id },
    );
    res.cookie(
      "empathyForLifeIdToken",
      idToken,
      { maxAge: ID_TOKEN_COOKIE_MAX_AGE },
    );

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to get user", { error: err }),
    );
  }
};

const signInUser = async (req, res, next) => {
  const payload = { message: "", result: null };

  try {
    const authorization = req.get("authorization");
    const googleIdToken = getToken(authorization);

    if (!googleIdToken) {
      payload.message = "invalid request";

      return res.json(payload);
    }

    const { name, email, uid } = await authenticateUser(googleIdToken);
    payload.message = "ok";

    if (await User.exists({ email })) {
      payload.result = await User.findOneAndUpdate(
        { email },
        { $addToSet: { uids: uid } },
        { runValidators: true, new: true, lean: true }
      );
    } else {
      payload.result = await User.create({
        user_name: name,
        email,
        uids: [uid],
        character: getRandomUserCharactor(),
      });
    }

    const idToken = generateIdToken(
      { id: payload.result._id },
    );
    res.cookie(
      "empathyForLifeIdToken",
      idToken,
      { maxAge: ID_TOKEN_COOKIE_MAX_AGE },
    );

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to sign in user", { error: err }),
    );
  }
};

exports.getUser = getUser;
exports.signInUser = signInUser;
