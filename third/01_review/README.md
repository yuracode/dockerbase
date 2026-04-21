# 01 — Dockerfile の振り返り（単独コンテナ）

前回学んだ内容を**実際に手を動かして**確認します。
DB もネットワークもなし、シンプルな Node.js サーバーを 1 つだけ起動します。

---

## ファイル構成

```
01_review/
├── .dockerignore
├── Dockerfile
├── package.json
├── server.js
└── README.md
```

---

## 確認ポイント

| 確認ポイント | キーワード |
|---|---|
| Dockerfile の 4 大命令 | `FROM` / `RUN` / `COPY` / `CMD`（それぞれのタイミングを説明できる？） |
| `docker image build -t my-app .` | `-t` はタグ名、`.` はビルドコンテキスト（Dockerfile のある場所） |
| `docker container run -p 3000:3000 my-app` | `-p` の左はホスト側、右はコンテナ側 |
| Dockerfile の書き順 | `package.json` → `npm install` → ソースコード（キャッシュを活かす順番） |
| ビルド失敗時の対処 | どのステップで失敗したかをエラーメッセージで特定する |

---

## ハンズオン手順

### ① イメージをビルドする

このフォルダ内で実行します。

```bash
docker image build -t review-hello-app .
```

初回は `node:20-alpine` のダウンロードと `npm install` で 1〜2 分かかります。

### ② コンテナを起動する

```bash
docker container run -d -p 3000:3000 --name review-hello review-hello-app
```

- `-d` ＝ バックグラウンド実行
- `-p 3000:3000` ＝ ホスト3000 → コンテナ3000
- `--name review-hello` ＝ コンテナに名前をつける（後で消しやすい）

### ③ 動作確認

ブラウザで http://localhost:3000 を開く
→ "Hello Docker!" が表示されれば成功

### ④ 後片付け

```bash
# コンテナを停止・削除
docker container stop review-hello
docker container rm review-hello

# イメージを削除
docker image rm review-hello-app
```

---

## Dockerfile 解説

```dockerfile
FROM node:20-alpine        # ベースイメージ（Alpine Linux + Node.js 20）

WORKDIR /app               # コンテナ内の作業ディレクトリ

COPY package.json ./       # 依存関係ファイルだけ先にコピー
RUN npm install            # ↑があるとコードを変えても npm install はキャッシュが効く

COPY . .                   # 残りのソースコードをコピー

EXPOSE 3000                # コンテナが 3000 番でリッスンすることを宣言

CMD ["node", "server.js"]  # コンテナ起動時に実行するコマンド
```

### キャッシュが効く書き順の理由

`COPY package.json` → `RUN npm install` → `COPY . .` の順にすることで、
`server.js` だけを変更した場合に `npm install` が再実行されません。
Docker は各ステップをキャッシュし、変更のないステップはスキップします。

---

## よくあるトラブル

### ポートが競合する

```
Error: driver failed programming external connectivity: Bind for 0.0.0.0:3000 failed
```

別のプロセスが 3000 を使っています。ホスト側のポートを変えて再実行してください。

```bash
docker container run -d -p 3001:3000 --name review-hello review-hello-app
# → http://localhost:3001 で確認
```

### `docker build` が進まない

- `package.json` のタイポ → JSON として不正
- ネットワーク接続が切れている → `npm install` でタイムアウト

---

## キーワード確認

- **イメージ** ＝ サーバーの設計書（読み取り専用）
- **コンテナ** ＝ イメージから作った実行中のサーバー
- **Dockerfile** ＝ イメージを作る手順書（Infrastructure as Code の入口）

次回以降に出てくる新しいキーワード：

- **Docker Compose** ＝ 複数のコンテナをまとめて管理するツール（`02_compose-single/` で初登場）

---

## 次のステップ

`02_compose-single/` に進み、**いま作ったこの Node.js サーバーを `docker-compose.yml` で起動する**ことを学びます。
同じ単独コンテナを、今度は Compose 経由で起動します。
