# Docker ハンズオン 2回目 — 授業リソース

---

## ディレクトリ構成

| フォルダ | 内容 |
|----------|------|
| `01_review/` | 前回コマンドの振り返りチェックリスト |
| `02_docker-commands/` | コンテナのライフサイクル・Dockerfile基本命令 |
| `03_static-html/` | Nginx で複数ファイル構成の静的サイトを表示 |
| `04_node-app/` | Node.js アプリの Dockerfile 作成・ビルド・起動 |
| `05_error-handling/` | エラーの読み方・デバッグコマンド・わざと失敗する例 |

---

## 授業の流れ

1. **01_review** — 前回コマンドを各自で打って確認
2. **02_docker-commands** — ライフサイクルと Dockerfile 命令を解説
3. **03_static-html** — Nginx でサイトを表示するハンズオン
4. **04_node-app** — Dockerfile を書いて Node.js をビルド・起動
5. **05_error-handling** — エラーを意図的に起こして読み方を練習

---

## 事前準備

```bash
# Docker が動くか確認
docker container run hello-world

# Node.js イメージを事前にダウンロード（授業前に実行推奨）
docker image pull node:20-alpine
docker image pull nginx:alpine
```
