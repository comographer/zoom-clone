const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
  console.log("Connected to the Server ✅");
}

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});
socket.addEventListener("close", () => {
  console.log("Disconnected from the Server ❌");
});
setTimeout(() => {
  socket.send("Hello from the browser!");
}, 5000);
