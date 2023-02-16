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
  const ENC_KEY = "bf3c199c2470cb477d907b1e0917c18b"; // set random encryption key
  const IV = "5183666c72eec9e5";
  var encrypt = (val) => {
    let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
    let encrypted = cipher.update(val, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  };
  const passwordHash = encrypt(password);
  const dbNameHash = encrypt(database);
  const dbUrlHash = encrypt(host);
  const dbUserHash = encrypt(host);
  // console.log({ passwordHash, dbNameHash, dbUrlHash, dbUserHash });
  const accessToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjo0LCJmaXJzdF9uYW1lIjoia2hhbGlkIiwiZW1haWwiOiJraGFsaWQuaGFiaWJAcXVhcnJpby5jb20iLCJzdWIiOiJraGFsaWQuaGFiaWJAcXVhcnJpby5jb20iLCJpYXQiOjE2NzY0NDE4MjAsImV4cCI6MTY4NTA4MTgyMH0.p1D0HrEhj7YjGF9Cxcuu6CEy671Dmmdzy1V9xX8X1EijqgcVlBtBAW0ZmCShWG4dcwwuFMIblYhAJGxqHYpfrQ";

  const data = {
    ...req.body,
    dbName: database,
    dbPassword: password,
    dbPort: 5432,
    dbSource: "heroku",
    dbUrl: host,
    dbUser: user,
  };
  console.log(accessToken);
  axios({
    method: "post",

    url: "https://poc-api-gateway.herokuapp.com/api/v/1.0/user/db-cred",
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((resp) => {
      // console.log(resp.data.data);
      return res.status(200).json({ message: "success" });
    })
    .catch((ex) => {
      // console.log(ex.response);
      return res.status(500).json({ ex });
    });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  initiatDatabase();
});
