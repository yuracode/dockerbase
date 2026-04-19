# 04 — Node.js アプリの Dockerfile 作成とビルド

---

## ファイル構成

```
04_node-app/
├── Dockerfile
├── .dockerignore
├── package.json
└── server.js
```

---

## コピペ用コマンド

### イメージをビルドする

このフォルダ内で実行してください。

```bash
docker image build -t my-node-app .
```

### コンテナを起動する

```bash
docker container run -p 3000:3000 my-node-app
```

動作確認: http://localhost:3000 → "Hello Docker!" が表示されれば成功！

停止は `Ctrl+C`

### バックグラウンドで起動する場合

```bash
docker container run -d -p 3000:3000 --name my-node my-node-app
```

```bash
# 確認
docker container ls

# 停止・削除
docker container stop my-node
docker container rm my-node
```

---

## Dockerfile 解説

```dockerfile
FROM node:20-alpine        # Node.js 20 入りの軽量 Alpine Linux を使用

WORKDIR /app               # コンテナ内の作業ディレクトリを /app に設定

COPY package.json ./       # ← まず package.json だけコピー
RUN npm install            # ← 依存関係をインストール（キャッシュが効く）

COPY . .                   # ← その後にソースコードをコピー

EXPOSE 3000                # ポート3000を使用することを宣言

CMD ["node", "server.js"]  # コンテナ起動時に実行するコマンド
```

### なぜ COPY package.json → RUN npm install → COPY . . の順番？

Docker はレイヤーをキャッシュします。  
ソースコードだけ変更した場合、`npm install` のステップがキャッシュされてビルドが速くなります。

---

## イメージの確認

```bash
# ビルドしたイメージを確認
docker image ls

# イメージの詳細を確認
docker image inspect my-node-app

# イメージを削除
docker image rm my-node-app
```
