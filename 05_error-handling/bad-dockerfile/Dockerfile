FROM node:18-alpine

WORKDIR /app

# わざとファイル名を間違えている → COPY に失敗する
COPY pakage.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]
