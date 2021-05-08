const mongoose = require("mongoose");
const validator = require("validator");

const { SCHEMA_TIMESTAMPS_OPTION } = require("../constants/constants");

const UserSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validator.isAlphanumeric, "it's invalid id. input only alphanumeric"],
    minLength: [1, "too short length id"],
    maxLength: [30, "too long length id"],
    required: [true, "admin_id is required"],
    index: true,
  },
  admin_password: {
    type: String,
    required: [true, "admin_password is required"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "input a valid email"],
    required: [true, "email is required"],
  },
  uids: [
    {
      type: String,
      validate: [validator.isAlphanumeric, "Invalid uid"],
    },
  ],
  user_name: {
    type: String,
    required: [true, "user_name is required"],
  },
  access_time: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => {
        if (0 <= value && value < Number.MAX_SAFE_INTEGER) {
          return true;
        }
      },
      message: "Exceeded max safe integer",
    },
    character: {
      type: String,
      enum: {
        values: ["brownShiba, darkShiba, grayShiba"],
        message: "{VALUE} is not supported",
      },
      required: [true, "character is required"],
    },
    isAdministrator: {
      type: Boolean,
      default: false,
    }
  },
}, SCHEMA_TIMESTAMPS_OPTION);

module.exports = mongoose.model("User", UserSchema);
