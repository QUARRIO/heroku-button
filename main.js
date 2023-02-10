const { Client } = require('pg');
const fs = require("fs");
const fastcsv = require("fast-csv");
const _ = require("lodash");

console.log('process.env.DATABASE_URL --------- ', process.env.DATABASE_URL);
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    // console.log(JSON.stringify(row));
  }
});

const readCSV = async (fileName) => {
  return new Promise((resolve, reject) => {
    let stream = fs.createReadStream(`./tables/${fileName}.csv`);
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .on("data", function (data) {
        csvData.push(data);
      })
      .on("end", function () {
        // remove the first line: header
        const headings = csvData[0];
        csvData.shift();
        resolve({ headings, csvData });
      });

    stream.pipe(csvStream);
  })
};

const createTable = async (table, headings, drop = false) => {
  const tableName = _.snakeCase(table)
  if (drop) {
    await client.query(`drop table if exists ${tableName};`);
  }
  const cols = [];
  for (let h of headings) {
    cols.push(`"${h}" TEXT`);
  };
  const colsStr = cols.join(', ');
  const createQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${colsStr}
    )
  `;
  await client.query(createQuery);
};

const saveData = async (table, headings, csvData) => {
  if (!csvData?.length) return;
  const tableName = _.snakeCase(table)
  const titles = _.map(headings, (h) => `"${h}"`);
  const data = _.map(csvData, (cd) => {
    const values = _.map(cd, (d) => `'${escape(d)}'`)
    return `(${values.join(', ')})`
  });

  const query = `
    INSERT INTO ${tableName}(${titles.join(', ')})
    VALUES ${data}
  `;
  try {
    await client.query(query);
  } catch (error) {
    console.log(' problem in query ------------- ', query);
    console.log('error ------- ', error);
  }
}

const run = async () => {
  client.connect();
  const tables = ["account", "contact", "lead", "opp", "user"];
  for (let table of tables) {
    try {
      console.log('table >>> ', table);
      const { headings, csvData } = await readCSV(table);
      await createTable(table, headings, true);
      await saveData(table, headings, csvData);
    } catch (error) {
      console.log('error ------- ', error);
    }
  }
};

run()
  .then(() => {
    client.end();
    return process.exit(0)
  })
  .catch((e) => {
    console.log('e --------------- ', e);
    process.exit(1);
  });
