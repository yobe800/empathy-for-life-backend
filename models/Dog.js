const mongoose = require("mongoose");
const validator = require("validator");

const { SCHEMA_TIMESTAMPS_OPTION } = require("../constants/constants");

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [1, "too short dog's name"],
    required: [true, "dog's name is required"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "gender is required"],
  },
  breed: {
    type: String,
    required: [true, "breed is required"],
  },
  age: {
    type: Number,
    min: 0,
    max: 99,
    required: [true, "age is required"],
  },
  weight: {
    type: Number,
    min: 0,
    max: 1000,
    required: [true, "weight is required"],
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
  heart_worm: {
    type: Boolean,
    required: [true, "heart_worm is required"],
  },
  neutering: {
    type: Boolean,
    required: [true, "neutering is required"],
  },
  entranced_at: {
    type: Date,
    required: [true, "entranced_at is required"],
  },
  adoption_status: {
    type: String,
    enum: ["ready", "wait", "completed"],
    default: "ready",
  },
  character: {
    type: String,
    enum: ["brownShiba", "darkShiba", "grayShiba"],
    default: "brownShiba",
  },
  description: {
    type: String,
    maxLength: 10000,
  },
}, SCHEMA_TIMESTAMPS_OPTION);

DogSchema.index({
  name: "text",
  breed: "text",
});

module.exports = mongoose.model("Dog", DogSchema);
