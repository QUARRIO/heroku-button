const fs = require("fs");
const { parse } = require("csv-parse");
const { Client } = require('pg');

/*
fs.createReadStream("./joel/tables/account.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log(row);
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });
*/

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('CREATE TABLE account2( ACCOUNTSOURCE VARCHAR(255), ACTIVE__C VARCHAR(255), ANNUALREVENUE VARCHAR(255), BILLINGCITY VARCHAR(255), BILLINGADDRESS VARCHAR(255), YEARSTARTED VARCHAR(255));', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
//});

  client.end();

});


