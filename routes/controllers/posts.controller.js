const createError = require("http-errors");
const validator = require("validator");

const createPayload = require("../../utils/createPayload");
const { uploadPhotoToS3, deletePhotoFromS3 } = require("../../aws/s3");

const Post = require("../../models/Post");

const addPost = async (req, res, next) => {
  try {
    const payload = createPayload();
    const post = req.body;

    if (!post) {
      payload.message = "A post is required";
    } else {
      const { writer, dogIds: dogs, content, photo } = post;
      const { photoUrl, photoKey } = await uploadPhotoToS3("post", "dogs/post", photo);
      const newPost = {
        writer,
        dogs,
        content,
        photo: {
          key: photoKey,
          url: photoUrl,
        },
      };

      await Post.create(newPost);
      payload.message = "ok";
    }

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed add a post", { error: err }),
    );
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post
    .find()
    .populate("writer", "user_name")
    .lean();
    const payload = createPayload("ok", posts);

    return res.json(payload);
  } catch (err) {
    next (
      createError(500, "failed get posts", {error: err }),
    );
  }
};

const getPost = async (req, res, next) => {
  try {
    const payload = createPayload();
    const { id } = req.params;
    if (!id) {
      payload.message = "A post id is required";
    } else {
      const post = await Post.findById(id).lean();
      payload.message = "ok";
      payload.result = post;
    }

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to get a post", { error: err }),
    );
  }
};

const editPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = createPayload();
    const post = req.body;
    if (!post) {
      payload.message = "A post is required";
    } else if (!id) {
      payload.message = "A post ID is required";
    } else {
      const { photo } = post;
      debugger;
      const isNewPhoto
        = photo
          && !!photo.trim()
          && photo.includes("base64")
          && validator.isBase64(photo.split(",")[1])
      if (isNewPhoto) {
        const { photo: { key }} = await Post.findById(id, "photo").lean();
        await deletePhotoFromS3(key);
        const { photoUrl, photoKey } = await uploadPhotoToS3("post", "dogs/post", photo);
        post.photo = {
          url: photoUrl,
          key: photoKey,
        };
      } else {
        delete post.photo;
      }

      await Post.findByIdAndUpdate(id, post);
      payload.message = "ok";
    }

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to edit a post", { error: err }),
    );
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = createPayload();

    if (!id) {
      payload.message = "A post ID is required to delete a post";
    } else {
      const { photo: { key } } = await Post.findById(id, "photo");
      await deletePhotoFromS3(key);
      await Post.findByIdAndDelete(id);
      payload.message = "ok";
    }

    return res.json(payload);
  } catch (err) {
    next(
      createError(500, "failed to delete a post", { error: err }),
    );
  }
};

module.exports = {
  addPost,
  getPosts,
  getPost,
  editPost,
  deletePost,
};
