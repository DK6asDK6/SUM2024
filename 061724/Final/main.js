import http from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { MongoClient, ObjectId } from "mongodb";
import fs from "node:fs/promises";
import process from "node:process";
// import { body, validationResult } from "express-validator";
// import bodyParser, { json } from "body-parser";

import { user, game, character } from "./client/classes/classes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("client"));

const baseURL = "mongodb://localhost:27017";
let client = new MongoClient(baseURL),
  userBase,
  roomsBase,
  charsBase;

async function launchBase() {
  const connection = await client.connect();

  let database = "DK6Dragon'sDungeon";
  const db = connection.db(database);
  userBase = db.collection("Users");
  roomsBase = db.collection("Games");
  charsBase = db.collection("Characters");
}

app.get("/main", async (req, res) => {
  let mes = req.body;

  let cntx = await fs.readFile(process.cwd() + "/client/room/index.html");
  cntx =
    cntx.splice(cntx.indexOf("</body>"), 1) +
    `
    <div id='info'>
      ${mes}
    </div>
  </body>
  `;

  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(cntx);
});

app.get("/toChoose", async (req, res) => {
  let cntx = await fs.readFile(process.cwd() + "/client/choosemap/index.html");
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(cntx);
});

const redir = async (res) => {
  res.redirect("/toChoose");
};

app.post("/login", async (req, res) => {
  const username = req.body.login,
    password = req.body.pass;

  const responce = await userBase.find({ name: username }).toArray();
  let cntxt = "";
  // console.log(responce);
  if (responce.length == 0 || responce[0].password != password) {
    cntxt = await fs.readFile(process.cwd() + "/client/login/onceagain.html");
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(cntxt);
  } else {
    redir(res);
  }
});

app.post("/register", async (req, res) => {
  const username = req.body.login,
    password = req.body.pass;

  const responce = await userBase.find({ name: username }).toArray();

  if (responce.length == 0) {
    let client = user(username, password);
    // let test = game("TEST", username);
    // client.enterRoom(test.personalName);

    await userBase.insertOne(client);
    await redir(res);
  } else {
    let cntxt = await fs.readFile(
      process.cwd() + "/client/register/onceagain.html"
    );
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(cntxt);
  }

  // userBase.insertOne({ name: username, password: password });
});

const server = http.createServer(app);

let clients = [];

const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  if (!clients.includes(ws)) clients.push(ws);

  ws.on("message", async (message) => {
    let mes = JSON.parse(message.toString());
    let player;

    switch (mes.type) {
      case "nonUser":
        if (clients.includes(ws)) clients.splice(clients.indexOf(ws), 1);
        break;
      case "getRooms":
        const users = await userBase.find({ name: mes.user }).toArray();

        if (users.length == 0) console.log("Jebana kurwa");
        else {
          player = users[0];
          let rooms = player.rooms;
          let msg = { type: "retRooms", rooms: rooms };
          ws.send(JSON.stringify(msg));
        }
        break;
      case "roomSubmit":
        let username = mes.user,
          roomName = mes.roomName;

        const rooms = await roomsBase.find({ roomName: roomName }).toArray();

        const players = await userBase.find({ name: username }).toArray();

        player = players[0];

        if (rooms.length == 0) {
          let room = game(roomName, username);

          user.enterRoom(room.personalName, player);
          game.appendUser(username, room);
          roomsBase.insertOne(room);
          userBase.updateOne(
            { name: username },
            {
              $set: {
                rooms: player.rooms,
              },
            }
          );
          ws.send(
            JSON.stringify({
              type: "access",
              _user: username,
              room: room.personalName,
            })
          );
        } else {
          let room = rooms[0];

          user.enterRoom(room.personalName, player);
          game.appendUser(username, room);
          roomsBase.updateOne(
            { personalName: room.personalName },
            {
              $set: {
                users: room.users,
              },
            }
          );
          userBase.updateOne(
            { name: username },
            {
              $set: {
                rooms: player.rooms,
              },
            }
          );

          ws.send(
            JSON.stringify({
              type: "accept",
              _user: username,
              room: room.personalName,
            })
          );
        }

        break;
    }
  });
});

const host = "localhost";
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
});

launchBase();
