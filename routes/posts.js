const router = require("express").Router();

const {
  addPost,
  getPosts,
  getPost,
  editPost,
  deletePost,
} = require("./controllers/posts.controller");

router.post("/new", addPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", editPost);
router.delete("/:id", deletePost);

module.exports = router;
