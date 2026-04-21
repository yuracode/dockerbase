# 04 — 自作の HTML を Nginx で表示する

Nginx のデフォルトページではなく、**自分で書いた HTML** をボリュームマウントで配信します。

---

## ファイル構成

```
04_static-html/
├── README.md
└── index.html
```

`index.html` はこのフォルダに同梱してあります。必要に応じて書き換えてみましょう。

---

## 前提：既存の Nginx コンテナを片付ける

もし `03_nginx/` で起動した `my-nginx` がまだ動いていたら、一度削除します。

```bash
docker container stop my-nginx
docker container rm my-nginx
```

---

## 実行コマンド

**必ず `04_static-html/` フォルダに移動してから**実行してください。

```bash
docker container run --name my-nginx \
  -p 8080:80 \
  -v ${PWD}:/usr/share/nginx/html:ro \
  -d nginx:alpine
```

> Windows PowerShell でも `${PWD}` はそのまま使えます。
> cmd.exe の場合は `%cd%` に置き換えてください。

---

## 新登場のオプション `-v`（ボリュームマウント）

| 表記 | 意味 |
|------|------|
| `-v ホスト側:コンテナ側:ro` | ホストのフォルダをコンテナの指定パスにマウント |
| `${PWD}` | カレントディレクトリの絶対パス |
| `/usr/share/nginx/html` | Nginx のドキュメントルート（デフォルト） |
| `:ro` | read-only（読み取り専用） |

**マウント** ＝ 「ホストのフォルダ」を「コンテナの中の特定の場所」と繋げる仕組み。
コンテナから見ると、そこにファイルが置いてあるように見えます。

---

## 動作確認

ブラウザで [http://localhost:8080](http://localhost:8080) を開く。

→ 自作の「🐳 Hello Docker!」ページが表示されれば成功です。

### ホットリロードを体験

1. `index.html` をエディタで開く
2. `<h1>` の文字を書き換えて保存
3. ブラウザをリロード

→ **即時反映されます。** コンテナの再起動は不要。
これがボリュームマウントの強みです。

---

## 後片付け

```bash
docker container stop my-nginx
docker container rm my-nginx
```

---

## チェックポイント

- [ ] `index.html` の内容がブラウザに表示される
- [ ] ファイルを書き換えてリロードすると反映される
- [ ] `-v` オプションの意味（ホスト側:コンテナ側）を説明できる

---

## 発展：マウントしないとどうなる？

`-v` オプション無しで Nginx を起動すると、デフォルトの「Welcome to nginx!」ページが表示されます。
`-v` を付けることで、コンテナ内の HTML がホスト側のファイルで**上書きされた**状態になる、と考えるとわかりやすいです。
