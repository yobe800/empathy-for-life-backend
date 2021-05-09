const router = require("express").Router();

const { authAdmin } = require("./controllers/admin.controller");

router.post("/authentication", authAdmin);

module.exports = router;
