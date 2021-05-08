const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const userRouter = require("./routes/user");

app.use("/user", userRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({});
});

module.exports = app;
