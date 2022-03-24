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

// Function for adding message;
const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

// Function for handling message input;
const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
    input.value = "";
  });
};

const showRoom = () => {
  // Hide #welcome and show #room;
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  // Change h3 content as below;
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
};

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // Send event to the server side;
  socket.emit("enter_room", input.value, showRoom);
  // Set roomName as the input.value;
  roomName = input.value;
  // Empty the input;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("someone joined!");
});

socket.on("bye", () => {
  addMessage("someone left ㅠㅠ");
});

socket.on("new_message", addMessage);
