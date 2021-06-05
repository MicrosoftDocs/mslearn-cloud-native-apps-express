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

  generateMessageRecursive(
    socket,
    isConnected,
    0,
    randomIntFromInterval(0, 5) * 1000,
    undefined
  );
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const EVENT_LEVELS = ["high", "medium", "low"];
const EVENT_NAMES = {
  high: ["Failing Connection", "Low Power", "Low Stock"],
  medium: ["Empty", "Item removed", "Manual Maintenance Required"],
  low: ["Half full", "Recharged", "High power consumption"],
};
function generateMessageRecursive(
  socket,
  isConnected,
  messageCount,
  timeout,
  lastInterval
) {
  if (isConnected) {
    const msBeforeNextMessage = randomIntFromInterval(3, 5) * 1000;
    const levelIndex = randomIntFromInterval(0, 2);
    const eventIndex = randomIntFromInterval(0, 2);
    const fridgeNumber = randomIntFromInterval(0, 99);
    const event = {
      time: new Date().toISOString(),
      message: `Fridge ${fridgeNumber} - ${
        EVENT_NAMES[EVENT_LEVELS[levelIndex]][eventIndex]
      }`,
      level: EVENT_LEVELS[levelIndex],
    };
    socket.emit(NEW_EVENT_MESSAGE_ID, event);
    messageCount++;
    let newTimeout = setTimeout(() => {
      generateMessageRecursive(
        socket,
        isConnected,
        messageCount,
        msBeforeNextMessage,
        newTimeout
      );
    }, timeout);
  } else {
    if (lastInterval) {
      clearInterval(lastInterval);
    }
    return undefined;
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
