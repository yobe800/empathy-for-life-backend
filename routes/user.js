const router = require("express").Router();

const {
  signInUser,
  getUser,
  updateUser,
} = require("./controllers/user.controller");

router.get("/", getUser);
router.post("/sign-in", signInUser);
router.put("/", updateUser);

module.exports = router;
