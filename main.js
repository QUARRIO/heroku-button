const { Client } = require('pg');
const fs = require("fs");

console.log('process.env.DATABASE_URL --------- ', process.env.DATABASE_URL);
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


dbClient.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
});

var sql = fs.readFileSync("./demo.sql", "utf8");

dbClient.query(sql, (err, res) => {
    if (err) throw err
    console.log(res)
    dbClient.end()
  })

//////////
"use strict";
const express = require("express");
const app = express();
app.get("/", (req, res) => {
    res.type("text");
    res.send("Hello! From Quarrio!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
