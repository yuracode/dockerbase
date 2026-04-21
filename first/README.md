# Docker ハンズオン 1回目 — 授業リソース

---

## ディレクトリ構成

| フォルダ | 内容 |
|----------|------|
| `01_hello-world/` | Docker の動作確認 — `docker container run hello-world` |
| `02_alpine/` | Alpine Linux コンテナに入ってシェル操作を体験 |
| `03_nginx/` | Nginx コンテナを起動してブラウザで確認（ポート公開） |
| `04_static-html/` | 自分で書いた HTML を Nginx でマウント表示 |
| `05_lifecycle/` | コンテナ一覧・停止・削除 — 基本管理コマンド |

---

## 授業の流れ

1. **01_hello-world** — Docker が動くことを確認
2. **02_alpine** — 対話モード（`-it`）でコンテナに入る
3. **03_nginx** — ポート公開（`-p`）でサーバを起動
4. **04_static-html** — ボリュームマウント（`-v`）で自作ページを表示
5. **05_lifecycle** — コンテナのライフサイクル（ls / stop / rm）

---

## 事前準備

```bash
# Docker がインストールされているか確認
docker --version

# Docker Desktop または Docker Engine が起動していれば OK
docker info
```

インストールがまだの場合：
- macOS / Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop/) をインストール
- Linux: ディストリビューションに応じて `docker-ce` を導入

---

## 今日のキーワード

- **イメージ（Image）** — サーバーの設計書（読み取り専用のテンプレート）
- **コンテナ（Container）** — イメージから作った実行中のサーバー
- `docker container run` = **pull + create + start** を一度に行うコマンド
