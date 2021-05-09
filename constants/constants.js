const SCHEMA_TIMESTAMPS_OPTION = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

const USER_CHARACTERS = Array(16).fill(null).map((_, index) => `person${index}`);

exports.SCHEMA_TIMESTAMPS_OPTION = SCHEMA_TIMESTAMPS_OPTION;
exports.USER_CHARACTERS = USER_CHARACTERS;
