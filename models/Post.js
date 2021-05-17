const mongoose = require("mongoose");
const validator = require("validator");

const { SCHEMA_TIMESTAMPS_OPTION } = require("../constants/constants");

const PostSchema = new mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "writer is required"],
  },
  dogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  content: {
    type: String,
    required: [true, "content is required"],
  },
  photo: {
    key: {
      type: String,
      required: [true, "photo key is required"],
    },
    url: {
      type: String,
      validate: [validator.isURL, "input right URL string"],
      required: [true, "photo is required"],
    }
  },
}, SCHEMA_TIMESTAMPS_OPTION);

module.exports = mongoose.model("Post", PostSchema);
