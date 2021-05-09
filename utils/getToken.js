const getToken = (authorization) => {
  return authorization?.split("Bearer ")[1];
};

module.exports = getToken;
