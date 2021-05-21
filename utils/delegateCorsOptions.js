const { whiteList } = require("../constants/constants");

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true,
      credentials: true,
      methods: "GET, POST, PUT, DELETE",
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
}

module.exports = corsOptionsDelegate;
