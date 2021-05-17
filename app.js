const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const logErrorInDevelopment = require("./utils/logErrorInDevelopment");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());

const userRouter = require("./routes/user");
const dogRouter = require("./routes/dog");
const adminRouter = require("./routes/admin");
const postsRouter = require("./routes/posts");

app.use("/user", userRouter);
app.use("/dog", dogRouter);
app.use("/admin", adminRouter);
app.use("/posts", postsRouter);

app.use((err, req, res, next) => {
  console.log(err);
  logErrorInDevelopment(err.error);
  res.status(err.status || 500);

  return res.json({ message: err.message });
});

module.exports = app;
