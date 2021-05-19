const getRandomInteger = require("./getRandomInteger");
const { CANVAS_SIZES } = require("../constants/constants");

const Dog = require("../models/Dog");

const generateDogsForDrawing = async (num = 10) => {
  const dogs = (await Dog
    .aggregate()
    .sample(num)
    .project("name character"))
    .map((dog) => {
    dog.targetCoordinates = {
      x: getRandomInteger(CANVAS_SIZES.x),
      y: getRandomInteger(CANVAS_SIZES.y),
    };
    dog.isUpdating = false;

    return dog;
  });

  return dogs;
};

module.exports = generateDogsForDrawing;
