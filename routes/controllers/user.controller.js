const createError = require("http-errors");

const User = require("../../models/User");

const { authenticateUser } = require("../../auth/firebase");
const getToken = require("../../utils/getToken");
const generateIdToken = require("../../utils/generateIdToken");
const getRandomUserCharactor = require("../../utils/getRandomUserCharactor");

const signInUser = async (req, res, next) => {
  try {
    const authorization = req.get("authorization");
    const googleIdToken = getToken(authorization);

    if (!googleIdToken) {
      return res.json();
    }

    const { name, email, uid } = await authenticateUser(googleIdToken);
    let user;

    if (await User.exists({ email })) {
      user = await User.findOneAndUpdate(
        { email },
        { $addToSet: { uids: uid } },
        { runValidators: true, new: true, lean: true }
      );
    } else {
      user = await User.create({user_name: name,
        email,
        uids: [uid],
        character: getRandomUserCharactor()
      });
    }

    const idToken = generateIdToken(
      { id: user._id, isAdministrator: user.is_administrator }
    );
    res.cookie(
      "empathyForLifeIdToken",
      idToken,
      { maxAge: 24 * 60 * 60 },
    );

    return res.json(user);
  } catch (err) {
    next(createError(500, "failed to sign in user", { error: err }));
  }
};

exports.signInUser = signInUser;
