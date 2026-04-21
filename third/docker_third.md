# Docker ハンズオン — 3回目

> **目標：** Docker Compose を使って複数コンテナのシステムを構築できるようになる
>
> 今回は**新しい概念を一気に入れず**、段階的に以下の流れで進めます。
>
> 1. Dockerfile の復習（**単独コンテナ**）
> 2. Docker Compose の入門（**単独サービス**）
> 3. Node.js + PostgreSQL（**複数コンテナ連携**）
> 4. ネットワークの確認
> 5. カスタムネットワーク（発展）

---

## 1. 前回の振り返り（単独コンテナ）

以下の内容がスラスラ書けますか？

| 確認ポイント | キーワード |
|---|---|
| Dockerfile の 4 大命令 | FROM / RUN / COPY / CMD（それぞれのタイミングを説明できる？） |
| `docker image build -t my-app .` | `-t` はタグ名、`.` はビルドコンテキスト（Dockerfile のある場所） |
| `docker container run -p 3000:3000 my-app` | `-p` の左はホスト側、右はコンテナ側 |
| Dockerfile の書き順 | `package.json` → `npm install` → ソースコード（キャッシュを活かす順番） |
| ビルド失敗時の対処 | どのステップで失敗したかをエラーメッセージで特定する |

`01_review/` のフォルダで実際にビルド・起動して確認しましょう。

---

## 2. Docker Compose とは？（単独サービスから始める）

### 現実の Web システムは複数のサーバーで動いている

```
[ブラウザ]
    ↓ HTTP リクエスト
[Nginx]        ← リクエストを転送するWebサーバー
    ↓
[Node.js]      ← データを読み書きするアプリサーバー
    ↓
[PostgreSQL]   ← データを保存するDBサーバー
```

**従来の構築：** 3 台のサーバーを個別に設定 → 数日かかる
**Docker Compose なら：** `docker-compose.yml` 1 ファイルに全サーバーを定義 → `docker compose up -d` で同時起動、ネットワークも自動構築

### まずは単独サービスから

いきなり複数サービスを扱うと、新しい概念が一度に増えて混乱します。
**まずはサービス 1 つだけ**の `docker-compose.yml` を書いて、Compose の文法に慣れましょう（`02_compose-single/`）。

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

これだけで `docker compose up -d` → http://localhost:3000 で動作確認できます。

### YAML の鉄則

**エラーの 8 割はインデントミスです。** 先に知っておきましょう。

| ルール | 内容 |
|--------|------|
| インデントはスペース **2 つ** | タブ文字は使わない |
| コロン `:` の後にスペース | `key: value` ← スペース必須 |
| 階層は必ず揃える | 同じ階層は同じ数のスペース |

よくあるエラー：
- `yaml.scanner.ScannerError` → インデントが揃っていない
- `mapping values are not allowed here` → `:` の後にスペースがない

> **VS Code のおすすめ設定：** YAML 拡張機能をインストールし、タブをスペースに変換する設定にしておく

---

## 3. 複数サービスへ（PostgreSQL を追加する）

単独サービスの Compose に慣れたら、`03_node-postgres/` で **2 つ目のサービスを追加**します。

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
      POSTGRES_PASSWORD: secret
```

ここで初めて登場するキー：

| キー | 意味 |
|------|------|
| `image` | 既存のイメージを使う場合に指定（`build` と対比） |
| `environment` | 環境変数を設定 |
| `depends_on` | 起動順序を指定（「先にこちらを起動する」という依存関係） |

### `depends_on` の限界（ハマりやすいポイント）

`depends_on` は「起動順」を制御するだけで、「使える状態か」は保証しません。

```
db コンテナが「起動した」
  ≠ PostgreSQL が「接続受付を開始した」（数秒〜十数秒かかる）
```

その間に `app` が DB 接続しようとすると → 接続エラー！

| 解決策 | 難易度 |
|--------|--------|
| アプリ側にリトライ処理を入れる | 簡単 |
| `healthcheck` + `condition` を使う | 推奨 |
| `wait-for-it.sh` スクリプトを使う | 簡易 |

今回のハンズオンでは簡単のためリトライなしで進めます。エラーが出た場合は少し待ってからリロードしてください。

---

## 4. ネットワークの概念

### ブリッジネットワークとは？

Docker Compose はデフォルトで専用の**ブリッジネットワーク**を自動作成します。

```
┌─────────────────────────────────────────┐
│  Docker ブリッジネットワーク（自動作成）  │
│                                         │
│  ┌──────────┐       ┌──────────────┐    │
│  │   app    │──────▶│      db      │    │
│  │(Node.js) │  "db" │ (PostgreSQL) │    │
│  └──────────┘       └──────────────┘    │
│                                         │
│  ※ サービス名がそのままホスト名になる     │
└─────────────────────────────────────────┘
```

- 同じネットワーク内のコンテナは、**サービス名で名前解決（DNS）** できる
- IP アドレスを意識せず `db` や `app` という名前で通信できる
- `server.js` で `host: 'db'` と書ける理由はこの仕組みによる

---

## 5. ハンズオン① — 単独サービスを Compose で起動（02_compose-single/）

### 5.1 ファイル構成

```
02_compose-single/
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── server.js
```

### 5.2 `docker-compose.yml`

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

### 5.3 起動と動作確認

```bash
docker compose up -d
# → http://localhost:3000 で "Hello Docker Compose!" を確認

docker compose ps      # サービス一覧
docker compose logs -f # ログ表示
docker compose down    # 停止・削除
```

> **ここまでで伝えたいこと：** Compose ファイルはサービス 1 つでも書ける。
> `docker run` の代わりに `docker compose up -d` を使うだけで、設定が YAML に残る。

---

## 6. ハンズオン② — Node.js + PostgreSQL システムの構築（03_node-postgres/）

単独サービスの Compose に慣れたら、DB サービスを追加します。

### 6.1 ファイル構成

```
03_node-postgres/
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── server.js
```

### 6.2 `package.json`

```json
{
  "name": "my-node-postgres-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0"
  }
}
```

### 6.3 `server.js`

```javascript
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
```

### 6.4 `Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### 6.5 `.dockerignore`

```
node_modules
.git
.env
*.log
Dockerfile
docker-compose.yml
```

### 6.6 `docker-compose.yml`

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
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"   # ホストから直接 psql 接続したい場合に開ける
```

### 6.7 システムを起動する

```bash
docker compose up -d
```

起動中のログを確認したい場合：

```bash
docker compose logs -f
```

> **確認：** `http://localhost:3000` → "Hello Docker Compose!" と PostgreSQL の現在時刻が表示されれば成功！

### 6.8 システムを停止する

```bash
# コンテナを停止・削除（ネットワークも削除される）
docker compose down

# イメージも合わせて削除したい場合
docker compose down --rmi all
```

---

## 7. ハンズオン③ — ネットワークの確認（04_network/）

コンテナが同じネットワークに属しているか、実際のコマンドで確認します。

### 7.1 ネットワーク一覧を確認する

```bash
docker network ls
```

`03_node-postgres_default` のような名前のネットワークが自動作成されているはずです。

### 7.2 ネットワークの詳細を確認する

```bash
docker network inspect 03_node-postgres_default
```

`Containers` セクションに `app` と `db` の両方が含まれているか確認しましょう。

### 7.3 コンテナ内から ping 疎通確認をする

```bash
# app コンテナのシェルに入る（03_node-postgres フォルダで実行）
docker compose exec app sh

# コンテナ内で db にping（サービス名で名前解決できるか確認）
ping db
```

IP アドレスが解決され、応答が返ってきたら「サービス名 = ホスト名」が機能している証拠です。

```bash
# シェルから抜ける
exit
```

---

## 8. 発展課題 — カスタムネットワーク（05_custom-network/）

デフォルトの自動生成ネットワークではなく、**明示的にネットワークを定義**します。
本番システムでは「フロント用」「バックエンド用」と分離するのが一般的です。

### 8.1 `docker-compose.yml` を書き換える

```yaml
services:
  app:
    build: ../03_node-postgres
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - my-network

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    networks:
      - my-network

networks:
  my-network:
    driver: bridge
```

### 8.2 再起動して確認する

```bash
docker compose down
docker compose up -d --build
docker network ls
```

`05_custom-network_my-network` という名前でネットワークが作成されていることを確認しましょう。

---

## 9. トラブル対応

### DB 接続エラーが出る

PostgreSQL の起動に数秒かかるため、`app` が先に接続しようとして失敗することがあります。

```bash
# しばらく待ってから app コンテナだけ再起動する
docker compose restart app
```

### コンテナがすぐ終了する

```bash
# ログを確認してエラーを特定する
docker compose logs app
docker compose logs db
```

### ネットワーク名がわからない

```bash
# プロジェクト名_default という命名規則で作られる
docker network ls | grep default
```

---

## 10. 本日のまとめ

| やったこと | 学んだこと |
|---|---|
| `01_review/` で単独コンテナを build/run | Dockerfile 4 大命令を思い出す |
| `02_compose-single/` でサービス 1 つを Compose 化 | `services` / `build` / `ports` の基本文法 |
| `03_node-postgres/` で DB サービスを追加 | `image` / `environment` / `depends_on` の使い方 |
| Node.js + PostgreSQL を同時起動 | 複数コンテナをコード 1 枚で管理できる |
| `docker network ls` / `inspect` で確認 | ブリッジネットワークが自動作成される仕組み |
| `ping db` で疎通確認 | サービス名がそのままホスト名になる理由 |
| カスタムネットワークを定義 | 本番構成に向けたネットワーク分離の考え方 |

### 次回予告

- データが消えない本番仕様へ → **ボリューム（Volume）** で DB データを永続化する
- 環境変数を `.env` ファイルで管理する

---

*授業資料 — 専門学校北海道サイバークリエイターズ大学校*
