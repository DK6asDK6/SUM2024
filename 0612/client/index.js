class _message {
  constructor(type, author, text) {
    this.data = {
      type: type,
      author: author,
      text: text,
    };
  }
}

function message(type, author, text) {
  return new _message(type, author, text);
}

let button, sendArea, messageArea, nameArea;
let socket;

function main() {
  button = document.getElementById("btn");
  sendArea = document.getElementById("msg");
  messageArea = document.getElementById("messager");
  nameArea = document.getElementById("userName");
}

export function buttonClick() {
  if (sendArea.value != "" && nameArea.value != "") {
    let nMes = message("send", nameArea.value, sendArea.value);
    nameArea.readOnly = true;
    sendArea.value = "";
    socket.send(JSON.stringify(nMes.data));
    socket.send(JSON.stringify(message("end-type", nameArea.value, "").data));
  }
}

function reactOnMessage(src) {
  let data = JSON.parse(src);
  if (data.type == "type") {
    // let writePrint = document.getElementById("printing");
    // writePrint.innerText = `${data.text}`;
    $("#printing").text(data.text);
    if (data.text == "") $("#printing").empty();
  } else {
    let st = `<tr><td class='msg'>${data.text}</td></tr>`;
    if (
      data.type == "send" &&
      (nameArea.value == "" || nameArea.value != data.author)
    )
      st = `<tr><td class='ot_msg'>[${data.author}]: ${data.text}</td></tr>`;
    messageArea.insertAdjacentHTML("beforeend", st);
  }

  // let st = `<tr><td class='msg'>${data.text}</td></tr>`;
  // if (data.type == "type" && data.author != "") {
  //   st = `<tr><td class='type'>${data.author} is typing...</td></tr>`;
  // } else if (
  //   data.type == "send" &&
  //   (nameArea.value == "" || nameArea.value != data.author)
  // )
  //   st = `<tr><td class='ot_msg'>[${data.author}]: ${data.text}</td></tr>`;
  // messageArea.insertAdjacentHTML("beforeend", st);
}

export function textChange() {
  if (nameArea.value != "") {
    if (sendArea.value != "") {
      socket.send(JSON.stringify(message("type", nameArea.value, "").data));
    } else {
      socket.send(JSON.stringify(message("end-type", nameArea.value, "").data));
    }
  }
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
