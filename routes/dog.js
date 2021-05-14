const router = require("express").Router();

const { getDog, getDogs, addDog } = require("./controllers/dog.controller");

router.get("/", getDogs);
router.post("/new", addDog);
router.get("/:id", getDog);

module.exports = router;
