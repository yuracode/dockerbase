# 05 — コンテナのライフサイクル（管理コマンド）

コンテナの**一覧 → 停止 → 削除**という基本の管理操作をまとめて練習します。

---

## ライフサイクルの全体像

```
   ┌─────────┐    run    ┌─────────┐   stop    ┌─────────┐    rm
   │ イメージ │──────────▶│ 起動中  │──────────▶│ 停止中  │──────▶ 消滅
   └─────────┘           └─────────┘           └─────────┘
                              ▲                     │
                              └─────────start───────┘
```

| フェーズ | コマンド | 備考 |
|---------|---------|------|
| 起動 | `docker container run` | イメージから新規作成＋起動 |
| 再起動 | `docker container start` | 停止中コンテナを再度起動 |
| 停止 | `docker container stop` | 起動中コンテナを安全に停止 |
| 削除 | `docker container rm` | 停止中コンテナを削除 |

---

## 練習用コンテナを用意する

まず、操作対象となるコンテナを 2 つ起動しておきます。

```bash
docker container run -d --name web1 -p 8081:80 nginx:alpine
docker container run -d --name web2 -p 8082:80 nginx:alpine
```

---

## 1. 一覧表示

```bash
# 起動中のみ
docker container ls
```

```bash
# 停止済みも含めて全部
docker container ls -a
```

### 主な列の読み方

| 列 | 意味 |
|----|------|
| `CONTAINER ID` | コンテナの一意な ID（通常は先頭12桁が表示される） |
| `IMAGE` | 元になったイメージ |
| `COMMAND` | コンテナ起動時に走るコマンド |
| `CREATED` | 作成からの経過時間 |
| `STATUS` | `Up` = 起動中、`Exited` = 停止中 |
| `PORTS` | ポートマッピング |
| `NAMES` | コンテナ名 |

---

## 2. 停止

名前または ID で指定できます。

```bash
docker container stop web1
```

`docker container ls` で確認すると、`web1` が消えて `web2` のみ残っているはずです。
`ls -a` を付ければ `web1` は `Exited` として表示されます。

---

## 3. 再起動

停止したコンテナは `start` で再び起動できます。

```bash
docker container start web1
```

`run` と違い、**新しいコンテナを作らず既存のものを再開**します。
内部に作ったファイルや設定はそのまま残っています。

---

## 4. 削除

削除には**停止済み**であることが条件です。

```bash
# 先に停止
docker container stop web1 web2

# 削除（複数指定もOK）
docker container rm web1 web2
```

### 強制削除（起動中でも削除したい場合）

```bash
docker container rm -f web1
```

`-f` は force。通常は `stop` → `rm` の順を推奨します。

---

## 5. まとめて片付ける

### 停止済みコンテナを一括削除

```bash
docker container prune
```

確認プロンプトが出ます（`y` で実行）。

### イメージ一覧

```bash
docker image ls
```

### 使っていないイメージを削除

```bash
# 特定のイメージを削除
docker image rm hello-world

# どのコンテナからも参照されていないイメージをまとめて削除
docker image prune
```

---

## よく使うオプションまとめ

| オプション | 意味 | 使う場面 |
|-----------|------|---------|
| `-it` | 対話＋ターミナル | シェルに入る |
| `-d` | バックグラウンド | サーバ系コンテナの起動 |
| `-p ホスト:コンテナ` | ポート公開 | ブラウザから接続する |
| `--name` | コンテナ名 | 後で操作しやすくする |
| `-v ホスト:コンテナ` | ボリュームマウント | ホストのファイルを使わせる |
| `--rm` | 停止時に自動削除 | 使い捨てコンテナ |

> `--rm` を付けると `exit` や `stop` と同時にコンテナが削除されます。
> 例：`docker container run --rm -it alpine /bin/sh`

---

## チェックポイント

- [ ] `docker container ls` と `ls -a` の違いを説明できる
- [ ] 特定のコンテナを `stop` → `rm` で削除できる
- [ ] `start` で停止済みコンテナを再開できる
- [ ] `prune` で停止済みコンテナをまとめて削除できる

---

## 次回への橋渡し

ここまでで、**既存のイメージ**を使ってコンテナを操作する基本は完了です。

次回は、**自分専用のイメージを Dockerfile で作る**ことに挑戦します。
- `FROM` / `COPY` / `RUN` / `CMD` の 4 大命令
- Node.js アプリを Docker で動かす
