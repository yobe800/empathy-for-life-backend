const { Server } = require("socket.io");

let io;

const handleSocket = () => {
  io.on("connection", (socket) => {
    if (!socket.users) {
      socket.users = [];
    }
    const { userName } = socket.handshake.auth;
    const user = { id: socket.id, name: userName };
    socket.users.push(user);

    socket.broadcast.emit("connected user", user);

    socket.on("disconnect", () => {
       socket.broadcast.emit("disconnected user", socket.id);
    });

    socket.on("chat", (message) => {
      socket.emit("chat", message);
    });

    socket.on("user canvas image", (drawElement) => {
      for (const user of socket.users) {
        if (user.id === socket.id) {
          Object.assign(user, drawElement);
          socket.broadcast.emit("another user draw element", user);
          break;
        }
      }
    });
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
