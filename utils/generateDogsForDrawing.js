const getRandomInteger = require("./getRandomInteger");
const { CANVAS_SIZES } = require("../constants/constants");

const Dog = require("../models/Dog");
const dogMock = [
  {
    _id: 1,
    name: "에밀리",
    character: "grayShiba",
  },
  {
    _id: 2,
    name: "둘리",
    character: "yellowShiba",
  },
  {
    _id: 3,
    name: "알리",
    character: "darkShiba",
  },
  {
    _id: 4,
    name: "두부",
    character: "yellowShiba",
  },
  {
    _id: 5,
    name: "동동",
    character: "grayShiba",
  },
  {
    _id: 6,
    name: "라즈",
    character: "darkShiba",
  },
  {
    _id: 7,
    name: "까미",
    character: "darkShiba",
  },
  {
    _id: 8,
    name: "순돌이",
    character: "yellowShiba",
  },
  {
    _id: 9,
    name: "팔코",
    character: "grayShiba",
  },
  {
    _id: 10,
    name: "레이나",
    character: "darkShiba",
  },
  {
    _id: 11,
    name: "켄",
    character: "yellowShiba",
  },
  {
    _id: 12,
    name: "애니",
    character: "yellowShiba",
  },
];

const generateDogsForDrawing = (num = 10) => {
  const dogs = Array(num).fill(null).map((_, index) => {
    // const dog = dogMock[Math.trunc(Math.random() * 12)];
    const dog = dogMock[index];
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
