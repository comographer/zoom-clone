// Enable connection to the server side;
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const backendDone = (msg) => {
  console.log(`The backend says: ${msg}`);
};

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // Send event to the server side;
  socket.emit("enter_room", { payload: input.value }, backendDone);
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
