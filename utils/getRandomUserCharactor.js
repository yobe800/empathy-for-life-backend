const { USER_CHARACTERS } = require("../constants/constants");

const getRandomUserCharactor = () => {
  const randomNum = Math.trunc(Math.random() * USER_CHARACTERS.length);

  return USER_CHARACTERS[randomNum];
};

module.exports = getRandomUserCharactor;
