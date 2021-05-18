const { Server } = require("socket.io");

const { CANVAS_SIZES, UPDATE_DOGS_TIME } = require("../constants/constants");
const getRandomInteger = require("../utils/getRandomInteger");
let broadcaster, io, updateDogsIntervalId, dogs, dogUpdatedTimestamp;
let users = [];

const generateDogsForDrawing = require("../utils/generateDogsForDrawing");

const handleSocket = () => {
  io.on("connection", (socket) => {
    if (!users.length) {
      dogs = generateDogsForDrawing(10);
      dogUpdatedTimestamp = Date.now();
    }

    const { userName } = socket.handshake.auth;
    const user = { id: socket.id, name: userName, createdAt: Date.now() };
    io.to(socket.id).emit("current users", users);
    users.push(user);
    io.to(socket.id).emit("current dogs", dogs);
    socket.broadcast.emit("connected user", user);

    socket.on(
      "disconnect",
      () => {
        let currentUser;
        users = users.filter((user) => {
          if (socket.id !== user.id) {
            return true;
          }

          currentUser = user;
        });
        currentUser.disconnectedAt = Date.now();

        if (broadcaster) {
          if (broadcaster !== currentUser.id) {
            socket.to(broadcaster).emit("left viewer", currentUser.id);
          } else {
            socket.broadcast.emit("close streaming", broadcaster);
            broadcaster = null;
          }
        }
        socket.broadcast.emit("disconnected user", currentUser);

        if (!users.length) {
          clearInterval(updateDogsIntervalId);
        }
      }
    );
    socket.on(
      "chat",
      (message) => {
        const { userName } = socket.handshake.auth;
        io.emit(
          "chat",
          {
            user: { id: socket.id, name: userName },
            message,
            createdAt: Date.now(),
          },
        );
      },
    );
    socket.on(
      "user canvas image",
      (drawElement) => {
        for (const user of users) {
          if (user.id === socket.id) {
            Object.assign(user, drawElement);
            socket.broadcast.emit("another user draw element", user);
            break;
          }
        }
      },
    );
    socket.on(
      "update a dog for drawing",
      (dogId) => {
        const findedDog = dogs.find((dog) => dog._id === dogId);

        if (findedDog.isUpdating) {
          return;
        }
        findedDog.isUpdating = true;
        setTimeout(() => {
          findedDog.targetCoordinates = {
            x: getRandomInteger(CANVAS_SIZES.x),
            y: getRandomInteger(CANVAS_SIZES.y),
          };
          io.emit("update a dog", findedDog);
          findedDog.isUpdating = false;
        }, getRandomInteger(5000));
      },
    );
    socket.on(
      "update all dog",
      () => {
        const current = Date.now();
        const shouldUpdate = dogUpdatedTimestamp + UPDATE_DOGS_TIME <= current

        if (shouldUpdate) {
          dogs = generateDogsForDrawing(10);
          dogUpdatedTimestamp = current;
        }
      },
    );
    socket.on(
      "start streaming",
      (broadcasterId) => {
        broadcaster = broadcasterId;
        socket.emit(
          "new viewers",
          users.filter(({ id }) => socket.id !== id),
        );
      },
    );
    socket.on(
      "register as viewer",
      () => {
        if (broadcaster) {
          socket.to(broadcaster).emit(
            "new viewers",
            [{ id: socket.id }],
          );
        }
      },
    );
    socket.on(
      "offer",
      (viewerId, event) => {
        event.broadcaster = broadcaster;
        socket.to(viewerId).emit(
          "offer",
          event.broadcaster,
          event.sdp,
        );
      },
    );
    socket.on(
      "answer",
      (event) => {
        socket.to(broadcaster).emit(
          "answer",
          socket.id,
          event.sdp,
        );
      },
    );
    socket.on(
      "candidate",
      (id, event) => {
        socket.to(id).emit("candidate", socket.id, event);
      },
    );
    socket.on(
      "stop streaming",
      (broadcasterId) => {
        broadcaster = null;
        socket.broadcast.emit("close streaming", broadcasterId);
      },
    );
  });
};

const connectSocket = (server) => {
  io = new Server(
    server,
    {
      cors: {
        origin: process.env.CLIENT_URL,
      },
    },
  );
  handleSocket();
};
exports.io = io;
exports.connectSocket = connectSocket;
