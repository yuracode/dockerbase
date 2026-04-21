const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello Docker!</h1>
    <p>単独コンテナで動いている Node.js サーバーです。</p>
  `);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
