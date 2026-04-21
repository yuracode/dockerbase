FROM node:20-alpine

WORKDIR /app

# 依存関係のインストール（キャッシュ活用のため package.json を先にコピー）
COPY package.json ./
RUN npm install

# ソースコードのコピー
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
