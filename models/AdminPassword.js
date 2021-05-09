const mongoose = require("mongoose");

const AdminPasswordSchema = new mongoose.Schema({
  password: {
    type: String,
    minLength: [10, "valid password length is at least 10"],
    required: [true, "password is required"],
  },
  salt: {
    type: String,
    required: [true, "salt is required"],
  },
});

module.exports = mongoose.model("AdminPassword", AdminPasswordSchema);
