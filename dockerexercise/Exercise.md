# Docker 演習課題 — Web サーバーから DB 連携まで

> **形式：** 個人演習  
> **提出物：** 各ステップで使用した `コマンド記録.md` / `Dockerfile` / `docker-compose.yml`

---

## はじめに

この演習では 3 つのステップを通じて、Docker による開発環境構築を体験します。  
**手順に従いながら、穴埋め部分は自分で考えて埋めてください。**  
コピペだけでは動きません。必ず自分の手で確認しながら進めましょう。

---

## フォルダ構成と提出方法

### 作業フォルダの作成

演習を始める前に、以下の 3 つのフォルダを作成してください。

```
dockerex1/      ← ステップ１の作業フォルダ
dockerex2/      ← ステップ２の作業フォルダ
dockerex3/      ← ステップ３の作業フォルダ
```

> **フォルダ名は必ずこの通りにしてください。**  
> 名前が違うと提出後の確認ができません。

### 提出物

演習終了後、以下の構成で提出してください。

```
dockerex1/
└── コマンド記録.md

dockerex2/
├── Dockerfile
├── server.js
├── package.json
├── .dockerignore
└── コマンド記録.md

dockerex3/
├── docker-compose.yml
├── Dockerfile
├── server.js
├── package.json
├── .dockerignore
└── コマンド記録.md
```

---

## ステップ１：Nginx で静的サイトを公開する

### 目標
Nginx コンテナを使って、自分で作った HTML/CSS を表示する。

### 1-1. 作業フォルダの準備

任意の場所に `dockerex1` フォルダに移動し、以下のファイル構成を作ってください。

```
dockerex1/
├── index.html
└── profile.html
```

### 1-2. ファイルの作成

**index.html**（内容は自由ですが、以下の条件を満たすこと）

- `profile.html` へのリンクを含む
- 自分の名前（またはニックネーム）を表示する

**profile.html**（内容は自由ですが、以下の条件を満たすこと）

- `index.html` へ戻るリンクを含む
- 自己紹介を何か書く

### 1-2-ex. 【時間があれば】CSS とテーブルを追加する

余裕があれば以下も追加してみましょう。

```
dockerex1/
├── index.html
├── profile.html
└── css/
    └── style.css
```

- `index.html` に `<link>` タグで `css/style.css` を読み込む
- `profile.html` に `<table>` タグで自己紹介を 3 行以上書く
- `css/style.css` に `header` / `main` / `footer` のスタイルを定義する

### 1-3. Nginx コンテナを起動する

以下のコマンドの `______` を埋めて実行してください。

```bash
docker run --name my-nginx \
  -p ______:80 \
  -v ______:/usr/share/nginx/html:ro \
  -d nginx:______
```

**ヒント：**
- ホスト側のポートは `8080` を使う
- `-v` にはカレントディレクトリを指定する（PowerShell と bash で書き方が違う）
- イメージは軽量版を使う

### 1-4. 動作確認

ブラウザで確認し、スクリーンショットを `コマンド記録.md` に貼り付けてください。

- `http://localhost:8080` → index.html が表示される
- `http://localhost:8080/profile.html` → profile.html が表示される
- CSS が適用されている

> **⚠️ `403 Forbidden` が表示された場合**  
> エラーを解決してから次に進んでください。  
> 解決したら `コマンド記録.md` に以下を記述すること。
>
> 1. なぜ 403 が出たのか（原因）
> 2. どうやって解決したか（手順）
> 3. Nginx が `index.html` を自動で探す仕組みを説明してください

### 1-5. 後片付け

```bash
docker ______ my-nginx
docker container ______ my-nginx
```

> **❓ 考察（コマンド記録.md に記述すること）**  
> `-v` オプションで `:ro` を付けている理由を自分の言葉で説明してください。

---

## ステップ２：Node.js アプリを Dockerfile でコンテナ化する

### 目標
自分で Dockerfile を書き、Node.js アプリのイメージをビルドして動かす。

### 2-1. 作業フォルダの準備

`dockerex2` フォルダに移動し、以下のファイルを作成してください。

### 2-2. `package.json` を作成する

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### 2-3. `server.js` を作成する

以下の穴埋めを完成させてください。

```javascript
const express = require('______');
const app = express();
const port = 3000;

// ルートパスへのアクセス
app.____('/', (req, res) => {
  res.send(`
    <h1>Hello Docker!</h1>
    <p>起動時刻: ${______}</p>
    <p>Node.js バージョン: ${______}</p>
  `);
});

app.listen(______, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

**ヒント：**
- 起動時刻は JavaScript の `Date` オブジェクトを使う
- Node.js のバージョンは `process` オブジェクトから取得できる

### 2-4. `Dockerfile` を作成する

以下の穴埋めを完成させてください。

```dockerfile
______ node:20-alpine

______ /app

______ package.json ./
______ npm install

______ . .

______ 3000

______ ["node", "server.js"]
```

### 2-5. `.dockerignore` を作成する

コンテナに含めるべきでないファイル・フォルダを自分で考えて記述してください。

```
# ここに記述する
```

> **❓ ヒント：** `node_modules` をコンテナに含めると何が問題になるか考えてみましょう。

### 2-6. イメージをビルドする

```bash
docker build -t ______ .
```

イメージ名は `my-node-app` にしてください。

### 2-7. コンテナを起動して確認する

```bash
docker run ______ my-node-app
```

`http://localhost:3000` でアクセスし、起動時刻と Node.js バージョンが表示されることを確認してください。

### 2-8. 後片付け

起動したコンテナを停止・削除してください（コマンドは自分で調べて記述）。

> **❓ 考察（コマンド記録.md に記述すること）**  
> Dockerfile で `COPY package.json ./` → `RUN npm install` → `COPY . .` の順番で書く理由を説明してください。

---

## ステップ３：Docker Compose で Node.js + PostgreSQL を連携する

### 目標
`docker-compose.yml` を使って Node.js と PostgreSQL を連携させたシステムを構築する。

### 3-1. 作業フォルダの準備

`dockerex3` フォルダに移動し、以下のファイル構成を作ってください。

```
dockerex3/
├── docker-compose.yml
├── Dockerfile
├── server.js
├── package.json
└── .dockerignore
```

### 3-2. `package.json` を作成する

```json
{
  "name": "my-compose-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0"
  }
}
```

### 3-3. `server.js` を作成する

以下の穴埋めを完成させてください。

```javascript
const express = require('express');
const { Pool } = require('______');
const app = express();
const port = 3000;

const pool = new Pool({
  host: '______',    // Docker Compose のサービス名を指定する
  port: ______,
  user: 'postgres',
  password: '______',
  database: 'postgres'
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.______('SELECT NOW() AS now, version() AS version');
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

### 3-4. `Dockerfile` を作成する

ステップ２の Dockerfile を参考に、自分で作成してください。  
（ステップ２からのコピーで構いません）

### 3-5. `docker-compose.yml` を作成する

以下の穴埋めを完成させてください。

```yaml
services:
  app:
    ______: .
    ports:
      - "______:3000"
    ______:
      - db

  db:
    ______: postgres:15
    environment:
      POSTGRES_______: dockerpass
    ports:
      - "5432:______"
```

### 3-6. システムを起動する

```bash
docker compose ______
```

起動後、ログを確認してエラーがないか確認してください。

```bash
docker compose ______ -f
```

> **⚠️ `Cannot find module` エラーが出た場合**  
> ビルドキャッシュが古いまま残っている可能性があります。  
> `docker compose up -d` ではなく以下の手順で再ビルドしてください。
>
> ```bash
> docker compose down
> docker build --no-cache -t <イメージ名> .
> docker compose up -d
> ```

### 3-7. 動作確認

`http://localhost:3000` でアクセスし、以下を確認してスクリーンショットを撮ってください。

- 「Docker Compose 連携成功！」と表示される
- PostgreSQL のサーバー時刻が表示される

### 3-8. ネットワーク確認

```bash
# ネットワーク一覧を確認する
docker network ______

# app コンテナから db への疎通確認
docker compose exec app ______
# コンテナ内で実行 →
ping ______
```

### 3-9. 後片付け

```bash
docker compose ______
```

> **❓ 考察（コマンド記録.md に記述すること）**  
> `server.js` の `host` に `'db'` と書くだけで PostgreSQL に接続できる理由を説明してください。  
> また、`depends_on` を書いても DB 接続エラーが起きる場合があります。その理由と対策を答えてください。

---

## 演習全体の振り返り（提出必須）

`コマンド記録.md` の最後に以下を自分の言葉で記述してください。

1. **Docker を使うメリット** を 3 つ挙げてください
2. **一番詰まった箇所** と、どうやって解決したかを書いてください
3. **仮想マシン（VM）と Docker コンテナの違い** を自分の言葉で説明してください（100 字以上）

---

