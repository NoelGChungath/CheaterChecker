const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
require("dotenv").config();
const users = {};
const socketToRoom = {};

app.use(express.static("public"));

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log("server is running on port 8000"));
app.get("/rooms", (req, resp) => {
  resp.send({ users });
});
io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (users[roomID]) {
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("sendMsg", (payload) => {
    io.to(payload.id).emit("cheater", {
      data: payload.data,
      name: payload.name,
      id: payload.id,
      myId: payload.myId,
      date: payload.time,
    });
  });

  socket.on("coord", (payload) => {
    io.emit("sendCoord", {
      data: payload.data,
      settings: payload.settings,
      room: payload.room,
    });
  });

  socket.on("clear", (payload) => {
    io.emit("sendClear", {
      room: payload.room,
    });
  });

  socket.on("checker", (payload) => {
    io.emit("startChecker", { roomId: payload.roomId });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
    socket.broadcast.emit("user disconnected", socket.id);
  });
});
