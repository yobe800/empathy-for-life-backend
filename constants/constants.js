const SCHEMA_TIMESTAMPS_OPTION = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

const USER_CHARACTERS = Array(16).fill(null).map((_, index) => `person${index}`);

const ID_TOKEN_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

exports.SCHEMA_TIMESTAMPS_OPTION = SCHEMA_TIMESTAMPS_OPTION;
exports.USER_CHARACTERS = USER_CHARACTERS;
exports.ID_TOKEN_COOKIE_MAX_AGE = ID_TOKEN_COOKIE_MAX_AGE;
