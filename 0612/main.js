import http from "node:http";
import fs from "node:fs/promises";
import process from "node:process";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.static("client"));

let clients = [];

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("message", (message) => {
    let mes = message.toString();
    for (let i in clients) clients[i].send(mes);
    console.log(mes);
  });
});

const host = "localhost";
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
});
