import { game, user } from "../classes/classes";

let socket;
let responce;

let pressed = false;

export function onNew() {
  let tablet = document.getElementById("choose");
  if (!pressed)
    tablet.innerHTML += `
  <tr>
    <td colspan="2">
      <label for "new"> Just enter game name and start! </label>
      <br />
      <input type="text" class="new" id="new"/>
    </td>
  </tr>
  `;

  pressed = true;
}

export async function onSubmit() {
  let existence =
    document.getElementById("new") != undefined ||
    document.getElementById("rooms").options[0] != undefined;

  console.log(window.localStorage.getItem("user"));
  let name = window.localStorage.getItem("user");
  if (name == undefined) name = window.sessionStorage.getItem("user");

  if (existence) {
    let mes = "";

    if (document.getElementById("new") != undefined) mes = $("#new").val();
    else {
      let sel = document.getElementById("rooms");
      mes = sel.options[sel.selectedIndex].text;
    }

    let message = JSON.stringify({
      user: name,
      roomName: mes,
    });

    window.sessionStorage.setItem("room", mes);

    // $.post({
    //   url: "/toRoom",
    //   headers: {
    //     "Content-Type": "application/json;charset=utf-8",
    //   },
    //   body: message,
    //   // body: {
    //   //   user: name,
    //   //   roomName: mes,
    //   // },
    // });

    await fetch("/toRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: message,
      // body: { user: name, roomName: mes },
    }).then(() => {
      window.location = "/room";
    });
  }
}

async function reactOnMessage(src) {
  responce = JSON.parse(src);

  if (responce.type == "retRooms") {
    let select = document.getElementById("rooms");

    for (let room1 of responce.rooms) {
      let room = room1.split(":")[1];
      select.innerHTML += `<option value="${room}">${room}</option>`;
    }
  } else if (responce.type == "access") {
    const mes = {
      room: responce.room,
      user: responce._user,
    };
    fetch("/main", {
      method: "GET",
      body: JSON.stringify(mes),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
  }

  console.log(responce);
}

function initCommunication() {
  socket = new WebSocket("ws://localhost:8000");

  socket.onopen = () => {
    console.log("open");
    socket.send(JSON.stringify({ type: "nonUser" }));

    let user = window.sessionStorage.getItem("user");

    if (user == null) user = window.localStorage.getItem("user");

    socket.send(
      JSON.stringify({
        type: "getRooms",
        user: user,
      })
    );
  };

  socket.onmessage = (event) => {
    reactOnMessage(event.data);
  };
}

export function init() {
  initCommunication();
  // main();
}

window.addEventListener("load", init);
