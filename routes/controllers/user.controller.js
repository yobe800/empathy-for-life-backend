const createError = require("http-errors");

const User = require("../../models/User");

const { authenticateUser } = require("../../auth/firebase");
const { ID_TOKEN_COOKIE_MAX_AGE } = require("../../constants/constants");
const getToken = require("../../utils/getToken");
const generateIdToken = require("../../utils/generateIdToken");
const getRandomUserCharactor = require("../../utils/getRandomUserCharactor");
const createPayload = require("../../utils/createPayload");

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

const signOutUser = (req, res, next) => {
  try {
    const payload = createPayload("ok");
    res.clearCookie("empathyForLifeIdToken");

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to destroy cookie", { error: err}),
    );
  }
};

const getUser = async (req, res, next) => {
  const { empathyForLifeIdToken } = req.cookies;
  const payload = { message: "", result: null };

  if (!empathyForLifeIdToken) {
    payload.message = "failed to get a user";
    return res.json(payload);
  }

  try {
    const { userId } = res.locals;
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

const updateUser = async (req, res, next) => {
  try {
    const { id, access_time } = req.body;
    const payload = createPayload();
    const user = await User.findByIdAndUpdate(id, { access_time });
    payload.message = "ok";

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to update a user", { error: err }),
    );
  }
};

module.exports = {
  signInUser,
  signOutUser,
  getUser,
  updateUser,
};
