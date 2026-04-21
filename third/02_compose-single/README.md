# 02 — Docker Compose で単独サービスを起動する

`01_review/` で書いた Dockerfile を、今度は `docker-compose.yml` から起動します。
サービスは **1 つだけ**（DB もネットワーク連携もなし）。
Compose の文法そのものに集中します。

---

## Docker Compose とは？

複数のコンテナをまとめて定義・管理するためのツールです。
1 つの YAML ファイル (`docker-compose.yml`) にサーバーの構成を書き、
`docker compose up -d` 1 コマンドで起動できます。

### `docker run` と Compose の対応

| | `docker run` | Docker Compose |
|---|---|---|
| 起動 | `docker container run -d -p 3000:3000 my-app` | `docker compose up -d` |
| 停止・削除 | `docker container stop / rm` | `docker compose down` |
| 設定の共有 | コマンドを各自コピペ | YAML ファイルを Git で共有 |

単独サービスなら `docker run` でも十分ですが、
**複数コンテナ**になるとコマンドが急に複雑になります。
そこで本番では必ず Compose を使います（次の `03_node-postgres/` で実感します）。

---

## ファイル構成

```
02_compose-single/
├── .dockerignore
├── Dockerfile
├── docker-compose.yml   ← 新登場
├── package.json
├── server.js
└── README.md
```

`Dockerfile` / `package.json` / `server.js` は `01_review/` とほぼ同じ内容です。
**差分は `docker-compose.yml` が追加されただけ**。

---

## ハンズオン手順

### ① サービスを起動する

このフォルダ内で実行します。

```bash
docker compose up -d
```

初回はイメージのビルドに 1〜2 分かかります。

### ② 動作確認

ブラウザで http://localhost:3000 を開く
→ "Hello Docker Compose!" が表示されれば成功

### ③ 起動中のサービスを確認する

```bash
docker compose ps
```

`app` サービスが `running` 状態であれば OK。

### ④ ログを確認する

```bash
docker compose logs -f
```

`Ctrl+C` で抜けてもコンテナは動き続けます。

### ⑤ 後片付け

```bash
# コンテナを停止・削除
docker compose down

# イメージも合わせて削除したい場合
docker compose down --rmi all
```

---

## docker-compose.yml 解説

```yaml
services:               # 起動するコンテナをリストアップ
  app:                  # サービス名（自由につけられる）
    build: .            # このフォルダの Dockerfile からビルド
    ports:
      - "3000:3000"     # ホスト3000 → コンテナ3000
```

### よく使うキー（今回登場分）

| キー | 意味 |
|------|------|
| `services` | 起動するコンテナをリストアップ |
| `build` | Dockerfile からビルドするフォルダを指定 |
| `ports` | ホストとコンテナのポートマッピング（`"ホスト:コンテナ"`） |

次の `03_node-postgres/` で `image` / `environment` / `depends_on` が追加で登場します。

---

## YAML の鉄則

**Compose エラーの 8 割はインデントミスです。** 先に知っておきましょう。

| ルール | 内容 |
|--------|------|
| インデントはスペース **2 つ** | タブ文字は使わない |
| コロン `:` の後にスペース | `key: value` ← スペース必須 |
| 階層は必ず揃える | 同じ階層は同じ数のスペース |

### よくあるエラー

```
yaml.scanner.ScannerError            → インデントが揃っていない
mapping values are not allowed here  → ":" の後にスペースがない
```

> **VS Code のおすすめ設定：** YAML 拡張機能をインストールし、タブをスペースに変換する設定にしておく

---

## よく使う Compose コマンド（チートシート）

```bash
docker compose up -d            # 全サービスをバックグラウンド起動
docker compose down             # 全サービスを停止・削除
docker compose down --rmi all   # イメージも削除
docker compose ps               # 起動中のサービス一覧
docker compose logs -f          # ログを追跡表示
docker compose logs app         # 特定サービスのログだけ
docker compose restart app      # 特定サービスだけ再起動
docker compose exec app sh      # サービスのコンテナに入る
docker compose up -d --build    # ソース変更後に再ビルド+再起動
```

---

## `docker run` との比較（同じことをする 2 つの方法）

```bash
# docker run なら
docker image build -t compose-single-app .
docker container run -d -p 3000:3000 --name app compose-single-app

# docker compose なら
docker compose up -d
```

Compose の嬉しさは **設定が YAML に書かれていて Git で共有できる**こと。
チーム全員が同じコマンド 1 つで環境を再現できます。

---

## トラブル対応

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

## 次のステップ

`03_node-postgres/` に進み、ここに **PostgreSQL サービスを追加**します。
サービスが 2 つになることで、Compose の本領である「複数コンテナの連携」が始まります。
