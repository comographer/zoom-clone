// http package included in node js;
import http from "http";
// Enable SocketIO;
import SocketIO from "socket.io";
// Enable express;
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
// Enable http server to run ws(SocketIO) server as well;
const wsServer = SocketIO(httpServer);

// Getting connection between server and browser;
wsServer.on("connection", (socket) => {
  // Follow and update socket events to server side;
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  // Receive event from client side;
  socket.on("enter_room", (roomName, done) => {
    // Join a socket group(room)
    socket.join(roomName);
    done();
    // Send "welcome" event to client side of roomName;
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    // Send "bye" event to all rooms' client side;
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
  socket.on("new_message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_message", msg);
    done();
  });
});

// Console log link when connection is made;
const handleListen = () => console.log(`Listening on http://localhost:3000`);
// Assign port number(3000) and handleListen function;
httpServer.listen(3000, handleListen);

/* 1.0 - 1.9
A socket is the connection between server and the browser;
*/

/* 2.0 SocketIO vs WebSockets
SocketIO is framework that supports real-time bidrectional and event-based communication;
It uses WS by default but also other methods to provide real-time communication;
*/

/* 2.1 Installing SocketIO
npm i socket.io;
By creating a SocketIO server, we get access to /socket.io/socket.io.js;
This script is given to the frontend;

To receive connection between server and browser: server.on("connection", (socket) => {});
When the connection is created, client side receives the function io() that automatically
enables connection to the server side: const socket = io();
*/

/* 2.2 SocketIO is Amazing
Frontend: socket.emit("event", msgObject, callbackFunction) sends event to the server side;
socket.emit() also receives a callbackFunction as thrid argument;
This is also sent to the server side;
Backend: socket.on("event", (msgObject, callbackFunction) => {}) receives the event from the client side;
The callbackFunction will be executed on the client side once server side finishes;
When that is happending, the callbackFunction can also bring and argument sent from the server side;
*/

/* 2.4 Rooms
SocketIO has function to create rooms(socket group) by default;
On the server side: socket.join("roomName");
Send a message to the room: socket.to("roomName");
*/

/* 2.5 Room Messages
To send a message to a room(Server side): socket.to("roomName").emit("event");
(Client side): socket.on("key", function);
*/

/* 2.6 Room Notifications
SocketIO also has event "disconnecting": client is going to be disconnect but hasn't left the room yet;
By using this, we can inform people in the room that someone is leaving;
Backend : 
socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
Frontend :
socket.on("bye", () => {
  addMessage("someone left ㅠㅠ");
});
*/
