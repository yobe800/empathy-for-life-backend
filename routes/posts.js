const router = require("express").Router();

const {
  addPost,
} = require("./controllers/posts.controller");

router.post("/new", addPost);

module.exports = router;
