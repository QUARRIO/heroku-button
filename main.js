const express = require('express')
const { Client } = require('pg');
const fs = require("fs");
var parseDbUrl = require("parse-database-url");

var dbConfig = parseDbUrl(process.env["DATABASE_URL"]);

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

console.log('DB_USERNAME:', dbConfig['user']);
console.log('DB_PASSWORD:', dbConfig['password']);
console.log('DB_HOST:', dbConfig['host']);
console.log('DB_NAME:', dbConfig['database']);
