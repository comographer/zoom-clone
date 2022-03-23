// Enable connection to the server side;
const socket = io();

// Grab HTML elements from client side JS;
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

// Hide div#room at the start;
room.hidden = true;

// Initially empty roomName;
let roomName = "";

const showRoom = () => {
  // Hide #welcome and show #room;
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  // Change h3 content as below;
  h3.innerText = `Room ${roomName}`;
};

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // Send event to the server side;
  socket.emit("enter_room", { payload: input.value }, showRoom);
  // Set roomName as the input.value;
  roomName = input.value;
  // Empty the input;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
