const router = require("express").Router();

const { authAdmin, signUpAdmin } = require("./controllers/admin.controller");

router.post("/authentication", authAdmin);
router.post("/sign-up", signUpAdmin);

module.exports = router;
