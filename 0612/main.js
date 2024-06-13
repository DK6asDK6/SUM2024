import http from "node:http";
import fs from "node:fs/promises";
import process from "node:process";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.static("client"));

let clients = [];
let messages = [];
let typing = [];

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  clients.push(ws);

  for (let i in messages) ws.send(messages[i]);

  ws.on("message", (message) => {
    let mes = message.toString();
    let data = JSON.parse(mes),
      type = data.type,
      author = data.author;
    if (type == "type") {
      if (!typing.includes(author)) typing.push(author);

      let st = "";

      for (let i = 0; i < typing.length - 1; ++i) {
        if (typing[i] != author) st = st + typing[i] + ", ";
      }

      st = st + typing[typing.length - 1];
      if (typing.length != 1) {
        st = st + " are writing...";
      } else st = st + " is writing...";

      let msg = {
        type: "type",
        author: "",
        text: st,
      };

      msg = JSON.stringify(msg);

      console.log("type: " + msg);
      ws.send(msg);
      for (let client of clients) client.send(msg);
    } else if (type == "end-type") {
      const index = typing.indexOf(author);
      if (index > -1) {
        typing.splice(index, 1);

        let st = "";

        if (typing.length > 0) {
          for (let i = 0; i < typing.length - 1; ++i) {
            st = st + typing[i] + ", ";
          }

          st = st + typing[typing.length - 1];
          if (typing.length != 1) {
            st = st + "are writing...";
          } else st = st + "is writing...";
        }

        let msg = {
          type: "type",
          author: "",
          text: st,
        };

        msg = JSON.stringify(msg);
        console.log("end-type: " + msg);
      }
    } else {
      messages.push(mes);

      for (let client of clients) client.send(mes);

      console.log("send: " + mes);
    }
  });
});

const host = "localhost";
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
});
