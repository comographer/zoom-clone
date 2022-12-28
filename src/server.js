import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening to http://localhost:${PORT}`);
// app.listen(PORT, handleListen);

// Gain access to the server
const server = http.createServer(app);

// Handling http server and ws server together on same port
const wss = new WebSocket.Server({ server });

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to the Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString()));
  });
});

server.listen(PORT, handleListen);
