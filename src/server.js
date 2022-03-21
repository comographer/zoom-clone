import http from "http";
import SocketIO from "socket.io";
import express from "express";

// Enable express;
const app = express();

// Set frontend view engine to Pug;
app.set("view engine", "pug");
// Assign location of Pug views directory;
app.set("views", __dirname + "/views");
// Make public directory accesible for frontend JS usage;
app.use("/public", express.static(__dirname + "/public"));
// Render home view template on root page(/);
app.get("/", (_, res) => res.render("home"));
// Redirect all requests to root page(/);
app.get("/*", (_, res) => res.redirect("/"));

// Create http server with express();
const httpServer = http.createServer(app);
// Enable http server to run ws server as well;
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "User";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// Console log link when connection is made;
const handleListen = () => console.log(`Listening on http://localhost:3000`);
// Assign port number(3000) and handleListen function;
httpServer.listen(3000, handleListen);
