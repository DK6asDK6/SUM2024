import { character } from "../classes/classes";

let socket;

let button; // Anton
let sendArea, messageArea;

let arr;
let isMaster = false;

let name, roomName, roomGlobalName, masterName;

function toHTML(message, client, master) {
  let _class = "ot_mes";

  if (message.author == "System") _class = "sys";
  else if (message.author == client) _class = "mes";
  else if (message.author == master) _class = "mas";
  else if (message.toMaster != undefined && message.toMaster) _class = "to_mas";

  return `
    <div class=${_class}>
      <div class="mes_user">
        ${message.char}(${message.author})
      </div>  
      <div class="mes_message">
        ${message.mes}
      </div>
    </div>
    `;
}

function onBtnClick() {
  let message = sendArea.value;
  sendArea.value = "";
  if (isMaster && $("#chars").val() != "" && message != "") {
    let charName = $("#chars").val();
    socket.send(
      JSON.stringify({
        type: "message",
        author: name,
        character: charName,
        room: roomGlobalName,
        message: message,
      })
    );
  } else {
    let e = document.getElementById("chars");
    if (e.options[0] != undefined) {
      let charName = e.options[e.selectedIndex].text;
      if (name != "" && message != "") {
        socket.send(
          JSON.stringify({
            type: "message",
            author: name,
            character: charName,
            room: roomGlobalName,
            message: message,
          })
        );
      }
    }
  }
}

function reactOnMessage(data) {
  let mes = JSON.parse(data);
  console.log(mes);
  switch (mes.type) {
    case "characters":
      arr = mes.characters;
      document.getElementById("chars").innerHTML = "";
      for (let character of arr) {
        console.log(character);
        document.getElementById("chars").innerHTML += `
      <option value=${character}>${character}</option>
      `;
      }
      break;
    case "master":
      isMaster = true;
      document.getElementById("charSelector").innerHTML = `
        <label for="chars">Enter character (you don't need to create full character for NPC):</label>
        <br />
        <input type="text" name="chars" id="chars" />
      `;
      break;
    case "message":
      // console.log(mes.message);

      let code = toHTML(mes.message, name, masterName);

      if (
        mes.message.toMaster != undefined &&
        mes.message.toMaster &&
        name != masterName &&
        mes.message.author != name
      )
        console.log(
          "denied " + name + " " + masterName + " " + mes.message.author
        );
      else messageArea.insertAdjacentHTML("beforeend", code);

      break;
  }
}

function initCommunication() {
  socket = new WebSocket("ws://localhost:8000");
  let info = document.getElementById("info");
  let st = info.textContent.split("/");
  debugger;
  name = st[0].trim();
  roomGlobalName = st[1];
  st = st[1].split(":");
  roomName = st[1];
  masterName = st[0];

  socket.onopen = () => {
    console.log("open");

    socket.send(
      JSON.stringify({ type: "Player", name: name, masterName: masterName })
    );

    socket.send(JSON.stringify({ type: "User", room: roomGlobalName }));

    setTimeout(() => {
      socket.send(
        JSON.stringify({ type: "Player", name: name, masterName: masterName })
      );
    }, 3000);
  };

  socket.onmessage = (event) => {
    reactOnMessage(event.data);
  };
}

export function onLoad() {
  button = document.getElementById("send");
  button.addEventListener("click", onBtnClick);

  sendArea = document.getElementById("msg");
  messageArea = document.getElementById("messager");

  initCommunication();
}

window.onload = onLoad;
