const router = require("express").Router();

const { signInUser } = require("./controllers/user.controller");

router.post("/sign-in", signInUser);

module.exports = router;

