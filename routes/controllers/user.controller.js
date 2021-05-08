const createError = require("http-errors");
const { authenticateUser } = require("../../auth/firebase");

const getToken = require("../../utils/getToken");

const signInUser = async (req, res, next) => {
  try {
    const authorization = req.get("authorization");
    const googleIdToken = getToken(authorization);

    if (!googleIdToken) {
      return res.json();
    }

    const { name, email, uid } = await authenticateUser(googleIdToken);


  } catch (err) {
    createError()
  }
};

exports.signInUser = signInUser;
