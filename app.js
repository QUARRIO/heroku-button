const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
var parseDbUrl = require("parse-database-url");
const axios = require("axios");

var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
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
    headers: {
      "Content-Type": "application/json",
    },
    url: "https://api.qca-qa.com/api/v/1.0/user/db-cred",
    data: data,
  })
    .then((resp) => {
      console.log(resp.data.data);
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
