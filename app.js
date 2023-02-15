const express = require("express");
var path = require("path");
const port = process.env.PORT || 3000;
var parseDbUrl = require("parse-database-url");
const axios = require("axios");
require("dotenv").config();
var crypto = require("crypto");

const app = express();

console.log(process.env.DATABASE_URL);
var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(express.static(__dirname + "/public"));
// app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const { initiatDatabase } = require("./config/pg");

app.get("/", (req, res) => {
  res.sendFile("views/root.html", { root: __dirname });
});

app.post("/complete-signup", (req, res) => {
  var dbConfig = parseDbUrl(process.env["DATABASE_URL"]);
  const { user, password, host, database } = dbConfig;
  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const dbNameHash = crypto.createHash("sha256").update(database).digest("hex");
  const dbUrlHash = crypto.createHash("sha256").update(host).digest("hex");
  const dbUserHash = crypto.createHash("sha256").update(host).digest("hex");
  // console.log({ passwordHash, dbNameHash, dbUrlHash, dbUserHash });
  const data = {
    ...req.body,
    dbName: database,
    dbPassword: password,
    dbPort: 5432,
    dbSource: "heroku",
    dbUrl: host,
    dbUser: user,
  };
  // console.log(data);
  axios({
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    url: "https://api.qca-qa.com/api/v/1.0/user/db-cred",
    data: data,
  })
    .then((resp) => {
      // console.log(resp.data.data);
      return res.status(200).json({ message: "success" });
    })
    .catch((ex) => {
      console.log(ex);
      return res.status(500).json({ ex });
    });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  initiatDatabase();
});
