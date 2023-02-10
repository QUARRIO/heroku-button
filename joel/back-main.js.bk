const { Client } = require('pg');

var format = require('pg-format');


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});

client.query('CREATE TABLE UsersTest (email varchar, firstName varchar, lastName varchar, age int);', (err, res) => {
  console.log(err);
  console.log(res);

});


var values = [
  ['johndoe@gmail.com', 'john', 'doe', '21']
];

client.query(format('INSERT INTO UsersTest (email, firstName, lastName, age) VALUES %L', values),[], (err, res)=>{
  console.log(err);
  console.log(res);

    client.end();
});
