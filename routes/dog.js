const router = require("express").Router();

const {
  getDog,
  getDogs,
  addDog,
  updateDog,
  deleteDog,
  getDogNames,
} = require("./controllers/dog.controller");

router.get("/names", getDogNames);
router.get("/", getDogs);
router.get("/:id", getDog);
router.post("/new", addDog);
router.put("/:id", updateDog);
router.delete("/:id", deleteDog);

module.exports = router;
