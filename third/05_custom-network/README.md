# 05 — カスタムネットワーク（発展課題）

デフォルトの自動生成ネットワークではなく、**明示的にネットワークを定義**します。
本番システムでは「フロント用」「バックエンド用」とネットワークを分離するのが一般的です。

---

## ファイル構成

```
05_custom-network/
└── docker-compose.yml    # app は 03_node-postgres/ の Dockerfile を再利用
```

> `build: ../03_node-postgres` としているため、アプリ側のコードは
> 03_node-postgres/ のものをそのまま使います。

---

## コピペ用コマンド

### 前のハンズオンを停止する

```bash
# 03_node-postgres/ で up している場合は先に停止
cd ../03_node-postgres
docker compose down
cd ../05_custom-network
```

### カスタムネットワークで起動する

```bash
docker compose up -d --build
```

### ネットワーク一覧を確認する

```bash
docker network ls
```

`05_custom-network_my-network` という名前のネットワークが作成されていることを確認しましょう。

### 詳細を確認する

```bash
docker network inspect 05_custom-network_my-network
```

`Containers` セクションに `app` と `db` の両方が含まれ、
同じネットワーク内で通信できる状態になっていれば成功です。

### 動作確認

- ブラウザで http://localhost:3000 を開く
- "Hello Docker Compose!" が表示されれば、カスタムネットワーク経由でも動くことが確認できる

### 後片付け

```bash
docker compose down
```

---

## docker-compose.yml 解説

```yaml
services:
  app:
    build: ../03_node-postgres   # Dockerfile は前のハンズオンを再利用
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - my-network               # ← このネットワークに所属させる

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    networks:
      - my-network               # ← 同じネットワークに所属させる

networks:
  my-network:                    # ← ネットワークを明示的に定義
    driver: bridge
```

### デフォルトとの違い

| | デフォルト | カスタムネットワーク |
|---|---|---|
| ネットワーク作成 | 自動 | `networks:` で明示 |
| サービスの所属指定 | 不要（全サービス自動所属） | 各サービスで `networks:` を指定 |
| 複数ネットワークへの所属 | 不可 | 可能（フロント用・バック用の分離） |

---

## 発展：2 つのネットワークに分離する

本番構成では「インターネットから到達できるフロントエンド用ネットワーク」と
「内部専用のバックエンド用ネットワーク」を分けるのが一般的です。

```yaml
services:
  web:
    image: nginx:alpine
    networks:
      - frontend        # フロント側のみに接続

  app:
    build: ../03_node-postgres
    networks:
      - frontend        # web から通信を受ける
      - backend         # db と通信する

  db:
    image: postgres:15
    networks:
      - backend         # 外部（web）からは直接到達できない

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

この構成だと `web` から `db` に直接は到達できません。
**必ず `app` を経由する** 構造が作れるため、セキュリティ上の利点があります。

---

## 次回予告

- データが消えない本番仕様へ → **ボリューム（Volume）** で DB データを永続化する
- 環境変数を `.env` ファイルで管理する
