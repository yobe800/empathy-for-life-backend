const router = require("express").Router();

const {
  signInUser,
  getUser,
  updateUser,
} = require("./controllers/user.controller");

const { authenticateUser } = require("../middlewares/authenticateUser");

router.post("/sign-in", signInUser);
router.use(authenticateUser);
router.put("/", updateUser);
router.get("/", getUser);

module.exports = router;
