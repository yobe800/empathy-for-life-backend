const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const logErrorInDevelopment = require("./utils/logErrorInDevelopment");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use((err, req, res, next) => {
  logErrorInDevelopment(err.error);
  res.status(err.status || 500);

  return res.json({ error: err.message });
});

module.exports = app;
