# 01 — 前回の振り返り

前回学んだコマンドが自信を持って打てるか確認しましょう。

---

## チェックリスト

| コマンド | 確認内容 |
|----------|----------|
| `docker container run hello-world` | Docker が動作していることを確認 |
| `docker container run -it alpine /bin/sh` | Alpine Linux コンテナに入り `ls` / `whoami` を実行 |
| `docker container run -p 8080:80 nginx` | ブラウザで `http://localhost:8080` を開き Nginx を確認 |
| `docker container ls` | 起動中のコンテナ一覧 |
| `docker container ls -a` | 停止済みも含めた全コンテナ一覧 |
| `docker container stop <ID>` | コンテナを停止 |
| `docker container rm <ID>` | コンテナを削除 |

---

## コピペ用コマンド

```bash
# Docker が動くか確認
docker container run hello-world
```

```bash
# Alpine コンテナに入る（exit で抜ける）
docker container run -it alpine /bin/sh
```

```bash
# Nginx を起動してブラウザで確認
docker container run -p 8080:80 nginx:alpine
```

```bash
# 起動中のコンテナを確認
docker container ls
```

```bash
# 停止済みも含めて確認
docker container ls -a
```

```bash
# コンテナを停止・削除（ID は docker container ls -a で確認）
docker container stop <コンテナID>
docker container rm <コンテナID>
```

---

## 静的 HTML を Nginx で表示する

`01_review/` フォルダ内で実行してください。

```bash
# カレントフォルダをマウントして Nginx を起動
docker container run --name my-nginx \
  -p 8080:80 \
  -v ${PWD}:/usr/share/nginx/html:ro \
  -d nginx:alpine
```

- トップページ: http://localhost:8080
- プロフィール: http://localhost:8080/profile.html
- `-v ${PWD}:...` でホストのファイルをコンテナにマウント → ファイル変更がリロードで即反映

```bash
# 後片付け
docker container stop my-nginx
docker container rm my-nginx
```

---

## バックグラウンド起動 → exec で接続する

```bash
# -d オプションでバックグラウンド起動
docker container run --name my-nginx-bg \
  -p 8080:80 \
  -d nginx:alpine
```

```bash
# 起動確認
docker container ls
```

```bash
# exec でコンテナ内のシェルに接続（exit で抜ける）
docker container exec -it my-nginx-bg /bin/sh
```

- `-d` ＝ デタッチモード（バックグラウンドで起動）
- `exec -it` ＝ 起動中のコンテナに対話的に接続
- `exec` は `run` と異なり、コンテナを新規作成せず既存コンテナに入る

```bash
# 後片付け
docker container stop my-nginx-bg
docker container rm my-nginx-bg
```

---

## キーワード確認

- **イメージ** ＝ サーバーの設計書（読み取り専用）
- **コンテナ** ＝ イメージから作った実行中のサーバー
- `docker container run` ＝ **pull + create + start** を一度に行う
