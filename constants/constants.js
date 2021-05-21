const SCHEMA_TIMESTAMPS_OPTION = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

const USER_CHARACTERS = Array(16).fill(null).map((_, index) => `person${index}`);

const ID_TOKEN_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
const UPDATE_DOGS_TIME = 3 * 60 * 1000;

const CANVAS_SIZES = {
  x: 1000,
  y: 920,
};

const whiteList = [
  process.env.CLIENT_URL_DEV,
  process.env.CLIENT_URL,
];

module.exports = {
  SCHEMA_TIMESTAMPS_OPTION,
  USER_CHARACTERS,
  ID_TOKEN_COOKIE_MAX_AGE,
  UPDATE_DOGS_TIME,
  CANVAS_SIZES,
  whiteList,
};
