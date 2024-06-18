import http from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { MongoClient, ObjectId } from "mongodb";
import fs from "node:fs/promises";
import process from "node:process";
// import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";

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

app.get("/toChoose", async (req, res) => {
  let cntx = await fs.readFile(process.cwd() + "/client/choosemap/index.html");
  res.setHeader("Content-Type", 200);
  res.writeHead(200);
  res.end(cntx);
});

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
    res.redirect("/toChoose");
  }
});

app.post("/register", async (req, res) => {
  const username = req.body.login,
    password = req.body.pass;

  const responce = await userBase.find({ name: username }).toArray();

  if (responce.length == 0) {
    await userBase.insertOne(user(username, password));
    res.redirect("/toChoose");
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

const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {});
});

const host = "localhost";
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
});

launchBase();
