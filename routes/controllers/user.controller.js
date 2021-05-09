const createError = require("http-errors");

const User = require("../../models/User");

const { authenticateUser } = require("../../auth/firebase");
const getToken = require("../../utils/getToken");
const logErrorInDevelopment = require("../../utils/logErrorInDevelopment");
const getRandomUserCharactor = require("../../utils/getRandomUserCharactor");

const signInUser = async (req, res, next) => {
  try {
    const authorization = req.get("authorization");
    const googleIdToken = getToken(authorization);

    if (!googleIdToken) {
      return res.json();
    }

    const { name, email, uid } = await authenticateUser(googleIdToken);

    const user = await User.findOne({ email });

    if (user) {
      await user.updateOne({ $addToSet: { uids: uid }}, { new: true, lean: true });

      return res.json(user);
    }

    const newUser = await User.create([{ user_name: name, email, uids: [uid], character: getRandomUserCharactor() }], { lean: true });

    return res.json(newUser[0]);

  } catch (err) {
    return next(createError(500, "failed to sign in user"));
  }
};

exports.signInUser = signInUser;
