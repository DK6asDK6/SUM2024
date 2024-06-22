import http from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { MongoClient, ObjectId } from "mongodb";
import fs from "node:fs/promises";
import process from "node:process";
// import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";
import morgan from "morgan";

import {
  user,
  game,
  character,
  message_structure,
} from "./client/classes/classes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("common"));
// app.use(express.multipart());
app.use(bodyParser());

const baseURL =
  "mongodb+srv://doadmin:x62jNC54Pi1W3t98@db-mongodb-pml30-2024-12312526.mongo.ondigitalocean.com/admin?tls=true&authSource=admin";
let client = new MongoClient(baseURL),
  userBase,
  roomsBase,
  charsBase;

async function launchBase() {
  const connection = await client.connect();

  let database = "PML30-2024-J";
  const db = connection.db(database);
  userBase = db.collection("DK6Users");
  roomsBase = db.collection("DK6Games");
  charsBase = db.collection("DK6Characters");
}

app.get("/charReady", async (req, res) => {
  const cntx = await fs.readFile(
    process.cwd() + "/client/character/success.html"
  );

  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(cntx);
});

app.post("/charCreate", async (req, res) => {
  let body = req.body;

  let userName = body.info;
  let name = body.name;
  let statBlock = [body.STR, body.DEX, body.CON, body.INT, body.WIS, body.CHA];
  let classes = [{ classname: body.class, level: body.level }];
  let race = body.race;
  let abilities = {
    save: [
      body.strsv == "on",
      body.dexsv == "on",
      body.consv == "on",
      body.intsv == "on",
      body.wissv == "on",
      body.chasv == "on",
    ],
    STR: [body.atl == "on"],
    DEX: [body.acr == "on", body.sle == "on", body.ste == "on"],
    INT: [
      body.arc == "on",
      body.his == "on",
      body.inv == "on",
      body.nat == "on",
      body.rel == "on",
    ],
    WIS: [
      body.ani == "on",
      body.ins == "on",
      body.med == "on",
      body.perc == "on",
      body.sur == "on",
    ],
    CHA: [
      body.dec == "on",
      body.int == "on",
      body.perf == "on",
      body.pers == "on",
    ],
  };
  console.log(abilities.save);
  let hits = body.hits;
  let ArmorClass = body.ac;
  let equipment = "";

  let char = character(
    userName,
    name,
    statBlock,
    classes,
    race,
    abilities,
    hits,
    ArmorClass,
    equipment
  );

  const responce = await charsBase
    .find({ name: name, userName: userName })
    .toArray();

  if (responce.length == 0) {
    charsBase.insertOne(char);
    let users = await userBase.find({ name: userName }).toArray();
    let player = users[0];

    user.appendCharacter(name, player);
    userBase.updateOne(
      { name: userName },
      {
        $set: {
          characters: player.characters,
        },
      }
    );
    res.redirect("/charReady");
  } else {
    charsBase.updateOne(
      { name: name, userName: userName },
      {
        $set: {
          stat: char.stat,
          mastery: char.mastery,
          class: char.class,
          level: char.level,
          PersBonus: char.PersBonus,
          abilities: char.abilities,
          bonuses: char.bonuses,
          hits: char.hits,
          ArmorClass: char.ArmorClass,
        },
      }
    );
  }
});

let un = "",
  rn = "";

app.get("/room", async (req, res) => {
  let cntx = await fs.readFile(process.cwd() + "/client/room/index.html");
  cntx =
    cntx.toString().replace("</body>", "") +
    `   <div hidden id='info'>
    ${un + "/" + rn}
    </div>
    </body>
    </html>`;
  // console.log(cntx);
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(cntx);
});

app.post("/toRoom", async (req, res) => {
  let mes = req.body;
  console.log(mes);
  let username = mes.user,
    roomName = mes.roomName;
  const rooms = await roomsBase.find({ roomName: roomName }).toArray();
  const players = await userBase.find({ name: username }).toArray();
  let player = players[0];
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
    un = username;
    rn = room.personalName;
    res.redirect("/room");
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

    un = username;
    rn = room.personalName;
    res.redirect("/room");
  }
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

app.use(express.static("client"));

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

        if (users.length == 0) console.log("...");
        else {
          player = users[0];
          let rooms = player.rooms;
          let msg = { type: "retRooms", rooms: rooms };
          ws.send(JSON.stringify(msg));
        }
        break;
      case "User":
        let roomName = mes.room.slice(0, mes.room.indexOf("\n"));

        const room = await roomsBase.find({ personalName: roomName }).toArray();

        let messages = room[0].messages;

        if (messages != null)
          for (message of messages)
            ws.send(
              JSON.stringify({
                type: "message",
                message: message,
              })
            );
        // JSON.stringify({ type: "message", room: curRoom, message: retmsg })
        break;
      case "Player":
        let playerName = mes.name.trim();
        let masterName = mes.masterName.trim();

        if (playerName != masterName) {
          let players = await userBase.find({ name: playerName }).toArray();
          let user = players[0];

          ws.send(
            JSON.stringify({ type: "characters", characters: user.characters })
          );
        } else ws.send(JSON.stringify({ type: "master" }));

        break;
      case "message":
        let author = mes.author.trim();
        let curRoom = mes.room.slice(0, mes.room.indexOf("\n"));
        let msg = mes.message;
        let char = mes.character;

        const responce = await roomsBase
          .find({ personalName: curRoom })
          .toArray();
        let roomC = responce[0];
        let retmsg = message_structure(author, char, msg, curRoom, false);

        if (msg.startsWith(".roll")) {
          let body = msg.split(" ")[1];
          body = body.split(":");
          let t = body[0];
          let bon = body[1];

          t = t.split("d");
          let num = t[0],
            size = t[1];

          let result = 0;
          let trs = [];
          let urs = [];

          for (let i = 0; i < num; i++) {
            let res = Math.round(Math.random() * (size - 1) + 1);
            result += res;
            trs.push(res);
          }

          if (author != roomC.masterName) {
            let characters = await charsBase
              .find({ personalName: author + ":" + char })
              .toArray();
            let character = characters[0];

            let type = bon.toUpperCase;

            switch (bon.toLowerCase()) {
              case "str":
                result += num * character.mastery.STR;
                for (let i in trs) urs.push(trs[i] + character.mastery.STR);
                type = "str";
                break;
              case "dex":
                result += num * character.mastery.DEX;
                for (let i in trs) urs.push(trs[i] + character.mastery.DEX);
                type = "dex";
                break;
              case "con":
                result += num * character.mastery.CON;
                for (let i in trs) urs.push(trs[i] + character.mastery.CON);
                type = "con";
                break;
              case "int":
                result += num * character.mastery.INT;
                for (let i in trs) urs.push(trs[i] + character.mastery.INT);
                type = "int";
                break;
              case "wis":
                result += num * character.mastery.WIS;
                for (let i in trs) urs.push(trs[i] + character.mastery.WIS);
                type = "wis";
                break;
              case "cha":
                result += num * character.mastery.CHA;
                for (let i in trs) urs.push(trs[i] + character.mastery.CHA);
                type = "cha";
                break;
              case "acrobatics":
              case "acr":
                result += num * character.bonuses.DEX.acrobatics;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.DEX.acrobatics);
                type = "acrobatics";
                break;
              case "animal":
              case "ani":
                result += num * character.bonuses.WIS.animalHandling;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.WIS.animalHandling);
                type = "animal handling";
                break;
              case "arcana":
              case "arc":
                result += num * character.bonuses.INT.arcana;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.INT.arcana);
                type = "arcana";
                break;
              case "athletics":
              case "ath":
                result += num * character.bonuses.STR.athletics;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.STR.athletics);
                type = "athletics";
                break;
              case "deception":
              case "dec":
                result += num * character.bonuses.CHA.deception;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.CHA.deception);
                type = "deception";
                break;
              case "history":
              case "his":
                result += num * character.bonuses.INT.history;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.INT.history);
                type = "history";
                break;
              case "insight":
              case "ins":
                result += num * character.bonuses.WIS.insight;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.WIS.insight);
                type = "insight";
                break;
              case "intimidation":
              case "inti":
                result += num * character.bonuses.CHA.intimidation;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.CHA.intimidation);
                type = "intimidation";
                break;
              case "investigation":
              case "inv":
                result += num * character.bonuses.INT.investigation;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.INT.investigation);
                type = "investigation";
                break;
              case "medicine":
              case "med":
                result += num * character.bonuses.WIS.medicine;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.WIS.medicine);
                type = "medicine";
                break;
              case "nature":
              case "nat":
                result += num * character.bonuses.INT.nature;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.INT.nature);
                type = "nature";
                break;
              case "perception":
              case "perc":
                result += num * character.bonuses.WIS.perception;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.WIS.perception);
                type = "perception";
                break;
              case "performance":
              case "per":
                result += num * character.bonuses.CHA.performance;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.CHA.performance);
                type = "performance";
                break;
              case "persuasion":
              case "pers":
                result += num * character.bonuses.CHA.persuasion;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.CHA.persuasion);
                type = "persuasion";
                break;
              case "religion":
              case "rel":
                result += num * character.bonuses.INT.religion;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.INT.religion);
                type = "religion";
                break;
              case "sleight":
              case "sle":
              case "soh":
                result += num * character.bonuses.DEX.sleightOfHand;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.DEX.sleightOfHand);
                type = "sleight of hand";
                break;
              case "stealth":
              case "ste":
                result += num * character.bonuses.DEX.stealth;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.DEX.stealth);
                type = "stealth";
                break;
              case "survival":
              case "sur":
                result += num * character.bonuses.WIS.survival;
                for (let i in trs)
                  urs.push(trs[i] + character.bonuses.WIS.survival);
                type = "survival";
                break;
            }

            retmsg = message_structure(
              "System",
              "bot",
              `${author} (${char}) throws ${num}d${size} with ${type.toUpperCase()} bonus: [${urs}] - ${result}`,
              false
            );
          } else {
            retmsg = message_structure(
              "System",
              "bot",
              `${num}d${size}: [${trs}] - ${result} (without bonuses).`,
              true
            );
          }
        } else if (msg.startsWith(".m")) {
          let body = msg.substring(3);
          if (msg.startsWith(".master")) body = msg.substring(8);
          retmsg = message_structure(author, char, body, curRoom, true);
        } else if (msg.startsWith(".u")) {
          let bodyUser = msg.substring(3);
          if (msg.startsWith(".user")) bodyUser = msg.substring(6);
          let name = bodyUser.substring(0, bodyUser.indexOf(" "));
          let body = bodyUser.substring(name.length + 1);
          retmsg = message_structure(author, char, body, curRoom, false, name);
        }

        game.appendMessage(retmsg, roomC);

        roomsBase.updateOne(
          { personalName: curRoom },
          {
            $set: {
              messages: roomC.messages,
            },
          }
        );

        for (let client of clients)
          client.send(JSON.stringify({ type: "message", message: retmsg }));

        break;
    }
  });
});

// const host = "localhost";
const port = 8000;

server.listen(port, () => {
  console.log(`Server started on http://:${port}`);
});

launchBase();
