const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({});
});

module.exports = app;
