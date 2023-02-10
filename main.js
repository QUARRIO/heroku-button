const { Client } = require('pg');
const fs = require("fs");

console.log('process.env.DATABASE_URL --------- ', process.env.DATABASE_URL);
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

dbClient.connect();

var sql = fs.readFileSync("./demo.sql", "utf8");
dbClient.query(sql);
