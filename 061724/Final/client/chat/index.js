import { launchCanvas } from "./dices/canvas";

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

let sendArea, messageArea, nameArea;
let socket;

function main() {
  button = document.getElementById("btn");
  sendArea = document.getElementById("msg");
  messageArea = document.getElementById("messager");
  nameArea = document.getElementById("userName");

  document
    .getElementById("sendFile")
    .addEventListener("change", async (event) => {
      if (window.jQuery) {
        let formData = new FormData();
        let img = $("#sendFile").val();
        if (img != undefined)
          formData.append(
            "myFile",
            $("#sendFile").val()
            // $("#sendFile").val().split("/").pop()
          );
        $.ajax({
          type: "POST",
          url: "/sendFile",
          data: formData,
          processData: false,
          contentType: false,
          success: () => {
            alert("success");
          },
        }).done(() => {
          socket.send(
            JSON.stringify(
              message(
                "sendFile",
                nameArea.value != "" ? nameArea.value : "",
                $("#sendFile")[0].files[0].name
              ).data
            )
          );
        });
      }
    });
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
    let writePrint = document.getElementById("printing");
    // writePrint.innerText = `${data.text}`;
    // $("#printing").empty(); <-- from there...
    $("#printing").text(data.text);
    if (data.text == "") $("printing").text(" "); // writePrint.innerHTML = ""; // <-- to there
  } else if (data.type == "file") {
    const getFile = async () => {
      axios.get("/receiveFile");
    };

    //
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
  launchCanvas();
  initCommunication();
});
