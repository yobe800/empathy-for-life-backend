const router = require("express").Router();

const {
  getDog,
  getDogs,
  addDog,
  updateDog
} = require("./controllers/dog.controller");

router.get("/", getDogs);
router.post("/new", addDog);
router.get("/:id", getDog);
router.put("/:id", updateDog);

module.exports = router;
