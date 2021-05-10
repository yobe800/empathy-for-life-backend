const router = require("express").Router();

const { authAdmin, signUpAdmin, signInAdmin } = require("./controllers/admin.controller");

router.post("/authentication", authAdmin);
router.post("/sign-up", signUpAdmin);
router.post("/sign-in", signInAdmin);

module.exports = router;
