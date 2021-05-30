const server = require("http").createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello World!");
  res.end();
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_EVENT_MESSAGE_ID = "newEvent";

io.on("connection", (socket) => {
  var isConnected = true;
  console.log(`Client ${socket.id} connected`);

  // Join the room requested by the client
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages and emit them to room
  socket.on(NEW_EVENT_MESSAGE_ID, (data) => {
    io.in(roomId).emit(NEW_EVENT_MESSAGE_ID, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
    isConnected = false;
  });

  // Generate new messages until client is disconnected
  let messageCount = 0;
  const timoutBase = 5000;
  let interval = setInterval(() => {
    if (isConnected) {
      const event = {
        time: new Date().toISOString(),
        message: "Message #" + messageCount,
      };
      socket.emit(NEW_EVENT_MESSAGE_ID, event);
      messageCount++;
    } else {
      clearInterval(interval);
    }
  }, timoutBase - (Math.floor(Math.random() * 2500) + 1));
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
