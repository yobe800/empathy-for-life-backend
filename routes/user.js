const router = require("express").Router();

const { signInUser, getUser } = require("./controllers/user.controller");

router.get("/", getUser);
router.post("/sign-in", signInUser);

module.exports = router;
