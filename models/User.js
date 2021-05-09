const mongoose = require("mongoose");
const validator = require("validator");

const { USER_CHARACTERS } = require("../constants/constants");
const { SCHEMA_TIMESTAMPS_OPTION } = require("../constants/constants");

const UserSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validator.isAlphanumeric, "it's invalid id. input only alphanumeric"],
    minLength: [1, "too short length id"],
    maxLength: [30, "too long length id"],
    index: true,
  },
  admin_password: {
    type: String,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "input a valid email"],
    required: [true, "email is required"],
    index: true,
  },
  uids: [
    {
      type: String,
      validate: [validator.isAlphanumeric, "Invalid uid"],
    },
  ],
  user_name: {
    type: String,
    trim: true,
    minLength: [1, "too short user name"],
    maxLength: [20, "too long user name"],
    required: [true, "user_name is required"],
  },
  access_time: {
    type: Number,
    default: 0,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  },
  character: {
    type: String,
    enum: {
      values: USER_CHARACTERS,
      message: "{VALUE} is not supported",
    },
    required: [true, "character is required"],
  },
  is_administrator: {
      type: Boolean,
      default: false,
  },
}, SCHEMA_TIMESTAMPS_OPTION);

module.exports = mongoose.model("User", UserSchema);