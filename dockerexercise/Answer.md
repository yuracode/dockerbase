# Docker 演習課題 — 解答

> 解答を見ながら進めてOKです。  
> ただし **コピペして終わりにしないこと**。必ず自分で実行して動作を確認してください。  
> 考察問題は自分の言葉で書くこと。

---

## ステップ１ 解答

### 1-3. Nginx 起動コマンド

```bash
docker run --name my-nginx \
  -p 8080:80 \
  -v ${PWD}:/usr/share/nginx/html:ro \
  -d nginx:alpine
```

> **PowerShell の場合は `${PWD}`、bash の場合は `$(pwd)` でも可**

### 1-5. 後片付け

```bash
docker stop my-nginx
docker container rm my-nginx
```

---

## ステップ２ 解答

### server.js

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello Docker!</h1>
    <p>起動時刻: ${new Date()}</p>
    <p>Node.js バージョン: ${process.version}</p>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### .dockerignore

```
node_modules
.git
.env
*.log
Dockerfile
```

### ビルドと起動

```bash
docker build -t my-node-app .
docker run -p 3000:3000 my-node-app
```

---

## ステップ３ 解答

### server.js

```javascript
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'postgres',
  password: 'dockerpass',
  database: 'postgres'
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now, version() AS version');
    res.send(`
      <h1>Docker Compose 連携成功！</h1>
      <p>接続先: ${pool.options.host}</p>
      <p>サーバー時刻: ${result.rows[0].now}</p>
      <p>PostgreSQL: ${result.rows[0].version}</p>
    `);
  } catch (err) {
    res.status(500).send(`
      <h1>エラー</h1>
      <p>${err.message}</p>
      <p>少し待ってからリロードしてください。</p>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: dockerpass
    ports:
      - "5432:5432"
```

> ⚠️ `server.js` の `password` と `POSTGRES_PASSWORD` は必ず同じ値にすること。  
> 違う値にすると DB 接続エラーになります。

### 起動・確認

```bash
docker compose up -d
docker compose logs -f
```

### ネットワーク確認

```bash
docker network ls

docker compose exec app sh
# コンテナ内で実行
ping db
exit
```

### 後片付け

```bash
docker compose down
```

---

## 提出ファイルの確認

提出前に以下をチェックしてください。

- [ ] `step1/コマンド記録.md` — スクリーンショット＋考察（`:ro` の理由）
- [ ] `step2/Dockerfile` — 正しく書けているか
- [ ] `step2/コマンド記録.md` — スクリーンショット＋考察（キャッシュの理由）
- [ ] `step3/docker-compose.yml` — パスワードが `server.js` と一致しているか
- [ ] `step3/コマンド記録.md` — スクリーンショット＋考察（サービス名・`depends_on`）
- [ ] 振り返り（3問）— 自分の言葉で書いてあるか

---

