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

server.listen(PORT, handleListen);

/* 
1.1 HTTP vs WebSockets
- HTTP works on 1 req, 1 res basis.
- WebSockets works on connection where multiple actions can happen as long as connection is there.
*/

/* 
1.2 WebSockets in NodeJS
- 
*/
