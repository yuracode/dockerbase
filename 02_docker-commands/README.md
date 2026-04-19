# 02 — コンテナのライフサイクルとDockerfileの基礎

---

## コンテナを起動してみよう

### ① run -it — まず体験する

```bash
# イメージからコンテナを作成して即起動、シェルに入る
docker container run -it --name test-container alpine
```

`/bin/sh` のプロンプトが表示されたら成功です。`exit` で抜けるとコンテナは停止します。

---

### ② run -d → exec

```bash
# バックグラウンドで起動
docker container run -d --name test-container2 alpine sleep infinity
```

```bash
# 後からシェルに入る
docker container exec -it test-container2 /bin/sh
```

```bash
# exit してもコンテナは動き続ける
docker container stop test-container2
```

> NginxやNode.jsなど常駐プロセス型のコンテナはこの形が基本です。

---

### ③ create → start — ライフサイクルを理解する

コンテナには「一生」があります。`run` は以下の2ステップを同時に行っています。

| フェーズ | コマンド | 意味 |
|----------|----------|------|
| **Create（作成）** | `docker container create` | イメージからコンテナの器を作る |
| **Start（起動）** | `docker container start` | コンテナ内のプロセスを起動する |
| **Stop（停止）** | `docker container stop` | プロセスを安全に停止する |
| **Rm（削除）** | `docker container rm` | 不要になったコンテナを削除する |

```bash
# 器だけ作る（まだ起動しない）
docker container create -it --name test-container3 alpine
```

```bash
# 起動してアタッチ
docker container start -ai test-container3
```

> `docker container run` は **Create + Start を同時**に行います。

---

## 管理コマンド

```bash
# 全コンテナの状態を確認
docker container ls -a
```

```bash
# コンテナを削除
docker container rm test-container
```

```bash
# 停止済みコンテナをまとめて削除
docker container prune
```

```bash
# ダウンロード済みイメージ一覧
docker image ls
```
---

## Dockerfile 基本命令

| 命令 | 意味 | 例 |
|------|------|----|
| `FROM` | ベースとなるイメージを指定 | `FROM node:18-alpine` |
| `WORKDIR` | コンテナ内の作業ディレクトリを指定 | `WORKDIR /app` |
| `COPY` | ホストのファイルをコンテナにコピー | `COPY package.json ./` |
| `RUN` | ビルド時に実行されるコマンド | `RUN npm install` |
| `EXPOSE` | 使用するポートをドキュメント化 | `EXPOSE 3000` |
| `CMD` | コンテナ起動時のデフォルトコマンド | `CMD ["node", "server.js"]` |

---

## Infrastructure as Code（IaC）とは

**これまでのサーバー設定：**
- SSH でサーバーに入る → コマンドを手打ち → エラーで原因不明 → 他のサーバーでも繰り返す…

**Dockerfile による設定：**
- テキストに手順を書く → `docker image build` で同じサーバーが何度でも再現
- Git で管理できる → チームで共有 → どこでも同じ環境

これが **IaC（Infrastructure as Code）** の入口です。