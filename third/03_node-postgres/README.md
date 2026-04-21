# 03 — Node.js + PostgreSQL を Compose で同時起動

`02_compose-single/` では**1 つの Node.js サービス**だけを Compose で起動しました。
ここでは **PostgreSQL を 2 つ目のサービスとして追加**し、
Compose の本領である「複数コンテナの連携」を初めて体験します。

---

## 02_compose-single/ との差分

追加されるもの：

- `db` サービス（`image: postgres:15` を使う）
- `depends_on` — `db` が起動してから `app` を起動する
- `environment` — `POSTGRES_PASSWORD` を渡す
- `server.js` 側で `pg` モジュールを使い `host: 'db'` で接続

**ポイント：** `host: 'db'` と書くだけで DB に繋がるのは、
Compose が自動で**ブリッジネットワーク**を作り、
サービス名を DNS 名として使えるようにしてくれるからです。
詳しくは `04_network/` で確認します。

---

## ファイル構成

```
03_node-postgres/
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.js
└── README.md
```

---

## ハンズオン手順

### ① システムを起動する

このフォルダ内で実行してください。

```bash
docker compose up -d
```

初回はイメージのダウンロードとビルドに数分かかります。
（`postgres:15` のダウンロードが加わるため `02_compose-single/` より少し長いです）

### ② 起動中のログを確認する

```bash
docker compose logs -f
```

`Ctrl+C` で抜けてもコンテナは動き続けます。

### ③ 動作確認

- ブラウザで http://localhost:3000 を開く
- "Hello Docker Compose!" と PostgreSQL の現在時刻が表示されれば成功

### ④ 起動中のサービスを確認する

```bash
docker compose ps
```

`app` と `db` の 2 つが `running` 状態であれば OK。

### ⑤ 後片付け

```bash
# コンテナを停止・削除（ネットワークも削除される）
docker compose down
```

```bash
# イメージも合わせて削除したい場合
docker compose down --rmi all
```

---

## docker-compose.yml 解説

```yaml
services:                       # 起動するコンテナをリストアップ
  app:                          # サービス名（＝ホスト名にもなる）
    build: .                    # このフォルダの Dockerfile からビルド
    ports:
      - "3000:3000"             # ホスト3000 → コンテナ3000
    depends_on:
      - db                      # db が起動してから app を起動する

  db:                           # サービス名（server.js の host: 'db' と対応）
    image: postgres:15          # DockerHub から既存イメージを使う
    environment:
      POSTGRES_PASSWORD: secret # 環境変数を渡す
    ports:
      - "5432:5432"             # ホストから psql で直接接続したい場合に開ける
```

### 今回初登場のキー

| キー | 意味 |
|------|------|
| `image` | 既存のイメージを使う場合に指定（`build` と対比） |
| `environment` | 環境変数を設定 |
| `depends_on` | 起動順序を指定（「先にこちらを起動する」という依存関係） |

---

## server.js のポイント

```javascript
const pool = new Pool({
  host: 'db',          // ← サービス名をそのままホスト名にできる
  port: 5432,
  user: 'postgres',
  password: 'secret',
  database: 'postgres'
});
```

`Pool` を使うと、リクエストごとに接続オブジェクトを再接続しようとして失敗する問題を避けられます。
ブラウザ更新のように複数回アクセスされても、そのまま安全に `pool.query()` を呼べます。

**なぜ `host: 'db'` で接続できるのか？**

Docker Compose はサービスを同じブリッジネットワーク上に配置し、
**サービス名をそのまま DNS 名として使えるようにしてくれる**ためです。

詳細は `04_network/` で確認します。

---

## `depends_on` の限界（ハマりやすいポイント）

`depends_on` は「起動順」を制御するだけで、「使える状態か」は保証しません。

```
db コンテナが「起動した」
  ≠ PostgreSQL が「接続受付を開始した」（数秒〜十数秒かかる）
```

その間に `app` が DB 接続しようとすると → **接続エラー！**

| 解決策 | 難易度 |
|--------|--------|
| アプリ側にリトライ処理を入れる | 簡単 |
| `healthcheck` + `condition` を使う | 推奨 |
| `wait-for-it.sh` スクリプトを使う | 簡易 |

今回のハンズオンでは簡単のためリトライなしで進めます。
エラーが出た場合は少し待ってからリロードしてください。

---

## トラブル対応

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

### ソースコードを変更しても反映されない

イメージは `docker compose up` 時にビルドされます。
ソースを変更したら再ビルドが必要です。

```bash
docker compose up -d --build
```

### ポートが競合する

```
Error: driver failed programming external connectivity: Bind for 0.0.0.0:3000 failed
```

`docker-compose.yml` の `ports` を変更（例：`"3001:3000"`）して再起動してください。

---

## ハンズオン手順のふりかえり

1. `package.json`, `server.js`, `Dockerfile`, `.dockerignore`, `docker-compose.yml` の 5 ファイルを確認
2. `docker compose up -d` で全サービスを起動
3. ブラウザで http://localhost:3000 を確認
4. `docker compose down` で停止・削除

次は `04_network/` に進み、コンテナ同士がどうやって通信しているかを確認します。
