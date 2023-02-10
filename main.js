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
