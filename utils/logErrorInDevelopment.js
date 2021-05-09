const logErrorInDevelopment = (err) => {
  if (process.env.NODE_DEV === "development") {
    console.error(err);
  }
};

module.exports = logErrorInDevelopment;
