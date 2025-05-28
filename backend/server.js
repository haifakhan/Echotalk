// server.js — Node.js backend with WebSocket support

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  let chunks = [];

  socket.on("audio-data", (data) => {
    chunks.push(Buffer.from(data));

    if (chunks.length >= 40) {
      const audioBlob = Buffer.concat(chunks);
      axios
        .post("http://localhost:5000/process", audioBlob, {
          headers: { "Content-Type": "application/octet-stream" }
        })
        .then((res) => {
          socket.emit("transcription", res.data);
        })
        .catch((err) => {
          console.error("Error from Python:", err.message);
        });

      chunks = [];
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
