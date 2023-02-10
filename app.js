const express = require("express");
const port = process.env.PORT || 3000;
const app = express();

const { initiatDatabase } = require("./config/pg");
app.get("/", (req, res) => {
  res.sendFile("views/root.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  initiatDatabase();
});
