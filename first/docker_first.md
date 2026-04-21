# Docker ハンズオン — 1回目

> **目標：** Docker のイメージとコンテナの違いを理解し、基本コマンドで Web サーバを起動できるようになる。
>
> 今日は**新しい概念を一気に詰め込まず**、以下の流れで体験しながら覚えます。
>
> 1. Docker が動くことを確認する
> 2. コンテナに入ってみる
> 3. Web サーバをコンテナで起動する
> 4. 自作の HTML をマウントして表示する
> 5. コンテナの管理コマンドを身につける

---

## 1. Docker とは？

### 「自分のPCでは動くんだけど…」問題

開発していると、こんな経験はありませんか？

- 自分のPCでは動くのに、友達のPCでは動かない
- サーバーにデプロイしたら動かない
- Node.js のバージョンが違う、ライブラリが入っていない…

**Docker は「動くまるごと」を箱（コンテナ）に詰めて持ち運べる技術**です。

```
┌─────────────────────────────────────┐
│  コンテナ（持ち運べるミニサーバー）   │
│   ├─ OS（Alpine / Ubuntu など）      │
│   ├─ ランタイム（Node.js / Python）  │
│   ├─ ライブラリ（npm install 済み）  │
│   └─ アプリのソースコード            │
└─────────────────────────────────────┘
        ↓ どこでも同じように動く
  開発PC / 同僚のPC / 本番サーバ
```

### イメージとコンテナ

Docker を理解する最初の壁が**イメージとコンテナの違い**です。

| 用語 | 例えるなら | 性質 |
|------|-----------|------|
| **イメージ（Image）** | 設計書・テンプレート | 読み取り専用。変更されない |
| **コンテナ（Container）** | 設計書から作った実体 | 起動・停止・削除できる |

**1つのイメージから、複数のコンテナを作れます。**

```
[nginx イメージ]
    ├─▶ コンテナA（ポート8080）
    ├─▶ コンテナB（ポート8081）
    └─▶ コンテナC（ポート8082）
```

---

## 2. ハンズオン① — Docker が動くことを確認する（01_hello-world/）

まずは Docker が正しく動作するか確認します。

```bash
docker container run hello-world
```

### 何が起きているのか？

`docker container run` コマンドは、内部で以下の 3 ステップを順に実行します。

| ステップ | 説明 |
|---------|------|
| **pull** | イメージがローカルに無ければ Docker Hub からダウンロード |
| **create** | イメージからコンテナの器を作成 |
| **start** | コンテナ内のプロセスを起動 |

初回はダウンロードに数秒〜数十秒かかりますが、2回目以降はキャッシュが効いて一瞬です。

### 期待する出力

```
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

このメッセージが表示されれば、Docker のインストールは成功です。

---

## 3. ハンズオン② — Alpine コンテナに入ってみる（02_alpine/）

次は、コンテナの中に入って Linux コマンドを実行してみます。

```bash
docker container run -it alpine /bin/sh
```

### オプションの意味

| オプション | 意味 |
|-----------|------|
| `-i` | interactive — 標準入力を開いたままにする |
| `-t` | tty — 疑似ターミナルを割り当てる |
| `alpine` | 使用するイメージ名（軽量な Linux） |
| `/bin/sh` | コンテナ内で起動するコマンド（シェル） |

> `-it` はほぼセットで使うので、まとめて覚えてOKです。

### コンテナ内で試してみるコマンド

```sh
# シェルに入ったら以下を試してみよう
ls              # ルート直下のファイル一覧
whoami          # 現在のユーザ（root）
cat /etc/os-release  # OS情報 → Alpine Linux と表示される
uname -a        # カーネル情報
exit            # コンテナから抜ける（コンテナは停止する）
```

### 気づきポイント

- コンテナの中身は**独立した Linux 環境**
- ホストPC（macOS / Windows）とは別の世界
- `exit` すると対話プロセスが終了 → コンテナも停止する

---

## 4. ハンズオン③ — Nginx を起動してブラウザで確認する（03_nginx/）

ここからが Docker の本領発揮。**Web サーバを 1 コマンドで起動**します。

```bash
docker container run -p 8080:80 -d --name my-nginx nginx:alpine
```

### オプションの意味

| オプション | 意味 |
|-----------|------|
| `-p 8080:80` | ホストの 8080 番 → コンテナの 80 番へポート転送 |
| `-d` | detach — バックグラウンドで起動 |
| `--name my-nginx` | コンテナに名前をつける（省略すると自動生成） |
| `nginx:alpine` | 軽量版 Nginx イメージ |

### 動作確認

ブラウザで [http://localhost:8080](http://localhost:8080) を開く → **Nginx のデフォルトページ**が表示されれば成功！

### ポートマッピングの図解

```
[ブラウザ]
   │  http://localhost:8080
   ▼
┌──────────────────────┐
│ ホストPC             │
│   8080番 ─────┐      │
│               │      │
│   ┌───────────▼───┐  │
│   │ コンテナ       │  │
│   │   80番 (Nginx) │  │
│   └───────────────┘  │
└──────────────────────┘
```

ポート番号は左右どちらも同じでも違ってもOK。左がホスト、右がコンテナ側。

### 後片付け

コンテナの削除は次のセクションで扱います。一旦起動したままで次へ進んでOKです。

---

## 5. ハンズオン④ — 自作の HTML を表示する（04_static-html/）

Nginx のデフォルトページではなく、**自分で書いた HTML** を表示してみましょう。

### 5.1 `index.html` を用意する

`04_static-html/` フォルダに以下の `index.html` を置きます。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>My First Docker Page</title>
</head>
<body>
  <h1>🐳 Hello Docker!</h1>
  <p>このページは Nginx コンテナで配信されています。</p>
</body>
</html>
```

### 5.2 ボリュームマウントで起動

まず、もし前のセクションの `my-nginx` が起動中なら一度削除してから実行します。

```bash
docker container stop my-nginx
docker container rm my-nginx
```

そして、`04_static-html/` フォルダに移動してから：

```bash
docker container run --name my-nginx \
  -p 8080:80 \
  -v ${PWD}:/usr/share/nginx/html:ro \
  -d nginx:alpine
```

### 5.3 新しいオプション `-v`（ボリュームマウント）

| 表記 | 意味 |
|------|------|
| `-v ホスト側:コンテナ側:ro` | ホストのフォルダをコンテナの指定パスに「マウント」する |
| `${PWD}` | カレントディレクトリの絶対パス（Windows PowerShell でもOK） |
| `/usr/share/nginx/html` | Nginx のドキュメントルート（デフォルト） |
| `:ro` | read-only（読み取り専用） |

### 5.4 動作確認

ブラウザで [http://localhost:8080](http://localhost:8080) → 自作の「🐳 Hello Docker!」が表示されれば成功。

**`index.html` を書き換えて保存 → ブラウザをリロード → 即反映されます。**
コンテナを再起動する必要はありません。これがマウントの強みです。

---

## 6. ハンズオン⑤ — コンテナの管理（05_lifecycle/）

コンテナを起動できたので、**一覧を確認したり、停止・削除する方法**を学びます。

### 6.1 コンテナ一覧

```bash
# 起動中のコンテナ一覧
docker container ls
```

```bash
# 停止中も含めた全コンテナ一覧
docker container ls -a
```

出力の主な列：

| 列 | 意味 |
|----|------|
| `CONTAINER ID` | コンテナの一意な ID（先頭12桁） |
| `IMAGE` | 元になったイメージ |
| `COMMAND` | コンテナ起動時のコマンド |
| `STATUS` | `Up` なら起動中、`Exited` なら停止中 |
| `PORTS` | ポートマッピング |
| `NAMES` | コンテナ名 |

### 6.2 コンテナの停止と削除

```bash
# 停止（名前 or ID で指定）
docker container stop my-nginx
```

```bash
# 削除（停止済みのみ削除できる）
docker container rm my-nginx
```

**停止してから削除する**のが基本の流れです。

### 6.3 まとめて片付ける

```bash
# 停止済みコンテナをまとめて削除
docker container prune
```

### 6.4 イメージの確認

```bash
# ダウンロード済みイメージ一覧
docker image ls
```

`hello-world` / `alpine` / `nginx` がダウンロードされていることが確認できます。

---

## 7. コンテナのライフサイクル

今日扱ったコマンドを整理すると、コンテナには以下の「一生」があります。

```
   ┌─────────┐    run    ┌─────────┐   stop    ┌─────────┐    rm
   │ イメージ │──────────▶│ 起動中  │──────────▶│ 停止中  │──────▶ 消滅
   └─────────┘           └─────────┘           └─────────┘
                              ▲                     │
                              └─────────start───────┘
```

| フェーズ | コマンド |
|---------|---------|
| 起動 | `docker container run` |
| 停止 | `docker container stop` |
| 再起動 | `docker container start` |
| 削除 | `docker container rm` |

> 次回は `create` と `start` を分けて呼ぶ、より細かいライフサイクル制御を扱います。

---

## 8. トラブル対応

### ポートが使われていますエラー

```
Bind for 0.0.0.0:8080 failed: port is already allocated
```

別のコンテナ（または別のアプリ）が 8080 番を使っています。

```bash
# 8080 番を使っているコンテナを探す
docker container ls

# 該当コンテナを停止・削除
docker container stop <名前>
docker container rm <名前>
```

または別のポートに変更：`-p 8081:80`

### コンテナ名の重複エラー

```
Conflict. The container name "/my-nginx" is already in use
```

同名のコンテナがすでに存在します。

```bash
# 既存を削除してから作り直す
docker container rm -f my-nginx
```

> `-f` は force — 起動中でも強制削除。通常は `stop` → `rm` の手順を推奨。

### ブラウザで表示されない

- `docker container ls` で `STATUS` が `Up` か確認
- `-p` の左右を逆にしていないか確認（左がホスト、右がコンテナ）
- ブラウザのキャッシュをクリアしてリロード

---

## 9. 本日のまとめ

| やったこと | 学んだこと |
|-----------|-----------|
| `docker container run hello-world` | `run` = pull + create + start |
| `docker container run -it alpine /bin/sh` | 対話モード（`-it`）でコンテナ内に入る |
| `docker container run -p 8080:80 -d nginx:alpine` | ポート公開（`-p`）とバックグラウンド起動（`-d`） |
| `-v ${PWD}:/usr/share/nginx/html:ro` | ホストのフォルダをコンテナにマウントする |
| `docker container ls` / `ls -a` | コンテナの一覧と状態を確認 |
| `docker container stop` / `rm` | コンテナを停止・削除 |

### キーワード確認

- **イメージ** ＝ サーバーの設計書（読み取り専用）
- **コンテナ** ＝ イメージから作った実行中のサーバー
- `run` は **pull + create + start** を同時に行う

### 次回予告

- **Dockerfile** を書いて**自分だけのイメージ**を作る！
- Node.js アプリをコンテナで動かす
- `FROM` / `RUN` / `COPY` / `CMD` の 4 大命令

---

*授業資料 — 専門学校北海道サイバークリエイターズ大学校*
