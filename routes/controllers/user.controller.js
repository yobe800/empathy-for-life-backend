const createError = require("http-errors");

const User = require("../../models/User");

const { authenticateUser } = require("../../auth/firebase");
const { IDTOKEN_COOKIE_MAX_AGE } = require("../../constants/constants");
const getToken = require("../../utils/getToken");
const generateIdToken = require("../../utils/generateIdToken");
const getRandomUserCharactor = require("../../utils/getRandomUserCharactor");

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
      { maxAge: IDTOKEN_COOKIE_MAX_AGE },
    );

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to sign in user", { error: err }),
    );
  }
};

exports.signInUser = signInUser;
