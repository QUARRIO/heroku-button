const express = require("express");
var path = require("path");
const port = process.env.PORT || 3000;
var parseDbUrl = require("parse-database-url");
const axios = require("axios");
require("dotenv").config();
// var crypto = require("crypto");
var CryptoJS = require("crypto-js");
const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJmaXJzdF9uYW1lIjoia2hhbGlkIiwiZW1haWwiOiJraGFsaWQuaGFiaWJAcXVhcnJpby5jb20iLCJzdWIiOiJraGFsaWQuaGFiaWJAcXVhcnJpby5jb20iLCJpYXQiOjE2NzY1NDg5MjQsImV4cCI6MTY4NTE4ODkyNH0.a-rv-pQnCErfB2YrdMcRumjIvYYyKKypzII0aRi97sM";

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
  // const IV = "BJKROC/dUFPfPFkgtGEXAg==";
  var encrypt = (val) => {
    const secretkey = "/8VNIvQDO//8xcUFgVPDGA=="; // set random encryption key
    var _key = CryptoJS.enc.Utf8.parse(secretkey);
    var iv = CryptoJS.enc.Utf8.parse(secretkey.substring(0, 16));

    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(val), _key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    encrypted = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    return encrypted;
  };
  const passwordHash = encrypt(password);
  const dbNameHash = encrypt(database);
  const dbUrlHash = encrypt(host);
  const dbUserHash = encrypt(host);
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
  console.log(data);
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
