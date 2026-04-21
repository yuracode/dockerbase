# 04 — ネットワークの確認

`03_node-postgres/` で起動したコンテナが同じネットワークに属していること、
そしてサービス名で名前解決できることを確認します。

---

## 前提

`03_node-postgres/` で `docker compose up -d` が起動中であることを前提とします。
まだ起動していない場合は以下を実行してください。

```bash
cd ../03_node-postgres
docker compose up -d
cd ../04_network
```

---

## ブリッジネットワークの図

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

## ① ネットワーク一覧を確認する

```bash
docker network ls
```

`03_node-postgres_default` のような名前のネットワークが自動作成されているはずです。

> **命名規則：** `<プロジェクト名>_default`
> プロジェクト名はデフォルトで「`docker-compose.yml` があるフォルダ名」

---

## ② ネットワークの詳細を確認する

```bash
docker network inspect 03_node-postgres_default
```

`Containers` セクションに `app` と `db` の両方が含まれているか確認しましょう。
それぞれのコンテナに内部 IP が割り当てられていることもわかります。

---

## ③ コンテナ内から ping 疎通確認をする

```bash
# app コンテナのシェルに入る
docker compose -f ../03_node-postgres/docker-compose.yml exec app sh
```

> フォルダを `03_node-postgres/` に移動して実行しても OK です。その場合は
> `docker compose exec app sh` で入れます。

コンテナ内で以下を実行します。

```sh
# コンテナ内で db にping（サービス名で名前解決できるか確認）
ping db
```

IP アドレスが解決され、応答が返ってきたら「サービス名 = ホスト名」が機能している証拠です。

> `ping` が入っていない場合は `apk add --no-cache iputils` でインストール、
> または `getent hosts db` / `nslookup db` で名前解決だけ確認しましょう。

```sh
# シェルから抜ける
exit
```

---

## ④ app コンテナから db へ直接 psql する（発展）

`db` サービス側のコンテナに入って PostgreSQL に接続してみます。

```bash
docker compose -f ../03_node-postgres/docker-compose.yml exec db psql -U postgres
```

接続できたら `SELECT NOW();` や `\l`（DB 一覧）を試してみましょう。
`\q` で抜けます。

---

## まとめ

| コマンド | 確認できること |
|----------|----------------|
| `docker network ls` | どんなネットワークが作られているか |
| `docker network inspect <名前>` | そのネットワークに属するコンテナと IP |
| `docker compose exec <svc> sh` | コンテナに入って内部を直接調査 |
| `ping db` / `getent hosts db` | サービス名で名前解決できることの確認 |
