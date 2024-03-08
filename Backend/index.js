const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const Runcompiler = require("./Routers/RunCompile.js");

app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("tab_change", (tab) => {
    socket.broadcast.emit("receive_tab", tab);
  });

  socket.on("code_change", (output) => {
    socket.broadcast.emit("recieve_code", output);
  });
  socket.on("lang_change", (lang) => {
    socket.broadcast.emit("recieve_lang", lang);
  });
  socket.on("input_change", (input_ch) => {
    socket.broadcast.emit("recieve_input", input_ch);
  });
});

app.use("/", Runcompiler);
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
