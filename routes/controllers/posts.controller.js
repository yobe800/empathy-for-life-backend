const createError = require("http-errors");

const createPayload = require("../../utils/createPayload");
const { uploadPhotoToS3 } = require("../../aws/s3");

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

module.exports = { addPost };
