let socket;
let usersRooms;

function main() {
  // socket.send(JSON.stringify({ type: "getRooms" }));
}

function reactOnMessage(src) {
  usersRooms = JSON.parse(src);
  console.log(usersRooms);
}

function initCommunication() {
  socket = new WebSocket("ws://localhost:8000");

  socket.onopen = () => {
    console.log("open");
  };

  socket.onmessage = (event) => {
    reactOnMessage(event.data);
  };
}

window.addEventListener("load", () => {
  main();
  initCommunication();
});
