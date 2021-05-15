const router = require("express").Router();

const {
  getDog,
  getDogs,
  addDog,
  updateDog,
  deleteDog,
} = require("./controllers/dog.controller");

router.get("/", getDogs);
router.post("/new", addDog);
router.get("/:id", getDog);
router.put("/:id", updateDog);
router.delete("/:id", deleteDog);

module.exports = router;
