const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`<h1>Hello Docker!</h1><p>Node.js アプリがコンテナで動いています</p><p>Node.js version: ${process.version}</p>`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
