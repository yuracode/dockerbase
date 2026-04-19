const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Bad App</h1>');
});

app.listen(3000);
