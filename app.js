const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const logErrorInDevelopment = require("./utils/logErrorInDevelopment");
const corsOptionsDelegate = require("./utils/delegateCorsOptions");

const { authenticateUser } = require("./middlewares/authenticateUser");

const app = express();

app.use(cors(corsOptionsDelegate));
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const dogRouter = require("./routes/dog");
const postsRouter = require("./routes/posts");

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use(authenticateUser);
app.use("/dog", dogRouter);
app.use("/posts", postsRouter);

app.use((err, req, res, next) => {
  logErrorInDevelopment(err.error || err);
  res.status(err.status || 500);

  return res.json({ message: err.message });
});

module.exports = app;
