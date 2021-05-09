const logErrorInDevelopment = (err) => {
  if (process.env.NODE_ENV === "development") {
    console.error(err, err.stack);
  }
};

module.exports = logErrorInDevelopment;
