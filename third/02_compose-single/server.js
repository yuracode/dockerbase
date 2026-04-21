const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello Docker Compose!</h1>
    <p>単独サービスを docker-compose.yml で起動しています。</p>
  `);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
