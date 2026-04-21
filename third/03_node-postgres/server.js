const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL 接続設定
// host に 'db' と書けるのは Docker Compose のブリッジネットワークの仕組みによる
const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'postgres',
  password: 'secret',
  database: 'postgres'
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.send(`
      <h1>Hello Docker Compose!</h1>
      <p>PostgreSQL 接続成功: ${result.rows[0].now}</p>
    `);
  } catch (err) {
    res.status(500).send(`<h1>DB 接続エラー</h1><p>${err.message}</p>`);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
