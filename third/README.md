# Docker ハンズオン 3回目 — 授業リソース

---

## ディレクトリ構成

| フォルダ | 内容 |
|----------|------|
| `01_review/` | 前回の振り返り — Dockerfile で**単独コンテナ**を build/run |
| `02_compose-single/` | Docker Compose 入門 — **単独サービス**を `docker-compose.yml` で起動 |
| `03_node-postgres/` | Node.js + PostgreSQL を Compose で**複数コンテナ**として同時起動 |
| `04_network/` | 自動生成されるブリッジネットワークを `ping` で疎通確認 |
| `05_custom-network/` | カスタムネットワークを明示的に定義する発展課題 |

---

## 授業の流れ（ゆっくり段階的に）

1. **01_review** — 単独コンテナの Dockerfile を実際に書いて build/run する
2. **02_compose-single** — 同じアプリを `docker-compose.yml` にする（サービス 1 つだけ）
3. **03_node-postgres** — PostgreSQL サービスを追加して複数コンテナ連携へ
4. **04_network** — 自動生成されたブリッジネットワークを確認
5. **05_custom-network** — カスタムネットワークを定義して再起動

各ステップで**新しい概念は 1 つだけ**追加されます。

---

## 事前準備

```bash
# Docker Compose が動くか確認（v2 は Docker 本体に同梱）
docker compose version

# 使用するイメージを事前にダウンロード（授業前に実行推奨）
docker image pull node:20-alpine
docker image pull postgres:15
```
