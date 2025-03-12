// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Sta alle origins toe

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Of specificeer hier de URL van je frontend
    methods: ["GET", "POST"]
  }
});

// Houd bij hoeveel gebruikers online zijn
let onlineUsers = 0;

io.on("connection", (socket) => {
  onlineUsers++;
  console.log("User connected. Online users:", onlineUsers);
  
  // Verstuur het actuele aantal online gebruikers naar alle clients
  io.emit("onlineUsers", onlineUsers);

  // Wanneer een client disconnect
  socket.on("disconnect", () => {
    onlineUsers--;
    console.log("User disconnected. Online users:", onlineUsers);
    io.emit("onlineUsers", onlineUsers);
  });
});

// Start de server op poort 4000
server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
