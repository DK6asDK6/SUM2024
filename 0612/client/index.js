let button, sendArea, messageArea, nameArea;
let socket;

function main() {
  button = document.getElementById("btn");
  sendArea = document.getElementById("msg");
  messageArea = document.getElementById("messager");
  nameArea = document.getElementById("userName");
}

export function buttonClick(event = null) {
  if (event != null) messageArea.insertAdjacentHTML("beforeend", event);
  else if (sendArea.value != "" && nameArea.value != "") {
    let st = `<br><div><span class='msg'>[${nameArea.value}]: ${sendArea.value}</span></div>`;
    // messageArea.insertAdjacentHTML("beforeend", st);
    sendArea.value = "";
    socket.send(st);
  }
}

function initCommunication() {
  socket = new WebSocket("ws://localhost:8000");

  socket.onopen = () => {
    console.log("open");
  };

  socket.onmessage = (event) => {
    buttonClick(event.data);
  };
}

window.addEventListener("load", () => {
  main();
  initCommunication();
});
