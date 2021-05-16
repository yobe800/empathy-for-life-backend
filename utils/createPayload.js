const createPayload = (message = "", result = null) => {
  return { message, result };
};

module.exports = createPayload;
