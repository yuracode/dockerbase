# 03 — Nginx で静的サイトを表示する

---

## ファイル構成

```
03_static-html/
├── Dockerfile
├── index.html
├── profile.html
├── css/
│   └── style.css
└── img/
    └── docky.jpeg   ← 任意の画像を置く（PNGでもOK）
```

> `img/docky.jpeg` は任意の画像ファイルでOKです。  
> Docker公式ロゴ: https://www.docker.com/company/newsroom/media-resources/

---

## コマンドラインで起動する（復習）

ボリュームマウントを使ってコンテナを起動する方法です。  
このフォルダ内で実行してください。

```bash
docker container run --name my-nginx \
  -p 8080:80 \
  -v ${PWD}:/usr/share/nginx/html:ro \
  -d nginx:alpine
```

### 動作確認

- トップページ: http://localhost:8080
- プロフィール: http://localhost:8080/profile.html

### 後片付け

```bash
docker container stop my-nginx
docker container rm my-nginx
```

---

## Dockerfile でイメージをビルドして起動する

ファイルをイメージに焼き込む方法です。  
このフォルダ内で実行してください。

### ① イメージをビルドする

```bash
docker image build -t my-nginx-image .
```

### ② ビルドされたイメージを確認する

```bash
docker image ls
```

`my-nginx-image` が一覧に表示されればビルド成功です。

### ③ コンテナを起動する

```bash
docker container run --name my-nginx -p 8080:80 -d my-nginx-image
```

### ④ 起動を確認する

```bash
docker container ls
```

`my-nginx` が `Up` 状態であればOKです。

### ⑤ ブラウザで確認する

- トップページ: http://localhost:8080
- プロフィール: http://localhost:8080/profile.html

### 後片付け

```bash
docker container stop my-nginx
docker container rm my-nginx
docker image rm my-nginx-image
```

---

## コマンドライン vs Dockerfile — 比較

| | コマンドライン（マウント） | Dockerfile（COPY） |
|---|---|---|
| **ファイルの扱い** | ホストのフォルダをそのまま参照 | イメージ内にファイルをコピー |
| **編集の反映** | 保存 → リロードで即反映 | 変更のたびに再ビルドが必要 |
| **持ち運び** | ホスト環境に依存する | イメージ単体でどこでも動く |
| **本番向き** | ✗（開発・確認向き） | ✓ |

**開発中はマウント、本番・配布はDockerfileというのが基本的な使い分けです。**

---

## Dockerfile 解説

```dockerfile
FROM nginx:alpine      # Nginx 入りの軽量 Alpine Linux を使用

COPY . /usr/share/nginx/html  # カレントディレクトリの全ファイルをコンテナにコピー
```

Nginx はデフォルトで `/usr/share/nginx/html` をドキュメントルートとして参照します。  
`COPY` でそこにファイルを置くだけで静的サイトが配信されます。

---

## コマンドラインオプション解説

| オプション | 意味 |
|------------|------|
| `--name my-nginx` | コンテナに名前をつける |
| `-p 8080:80` | ホストの8080番ポート → コンテナの80番ポート |
| `-v ${PWD}:/usr/share/nginx/html:ro` | 現在のフォルダをコンテナにマウント（読み取り専用） |
| `-d` | バックグラウンドで起動（detach） |
