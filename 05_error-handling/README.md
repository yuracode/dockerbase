# 05 — エラーを調べて回避する

---

## よくあるエラーと対処法

### エラー1: `docker image build` に失敗する

**確認手順：**

```bash
# ビルドを実行してエラーメッセージを確認
docker image build -t my-node-app .
```

**よくある原因：**

| 原因 | 確認方法 |
|------|----------|
| `Dockerfile` のファイル名ミス（大文字小文字） | `ls` で確認。`dockerfile` ではなく `Dockerfile` |
| `package.json` の記述ミス | `cat package.json` で JSON 構文を確認 |
| `COPY` 元のパス間違い | フォルダ内に対象ファイルが存在するか `ls` で確認 |

---

### エラー2: コンテナがすぐに終了する

**ログを確認する：**

```bash
# 直近のログを確認
docker container logs <コンテナ名またはID>
```

```bash
# リアルタイムでログを追跡する
docker container logs -f <コンテナ名またはID>
```

**よくある原因：**

- Node.js のランタイムエラー（コードにバグがある）
- ポートがすでに使用中（`address already in use`）
- 必要なファイルが見つからない（`Cannot find module`）

---

### エラー3: ポートが競合する

```
Error: listen EADDRINUSE: address already in use :::3000
```

**対処法：**

```bash
# 3000番ポートを使用しているプロセスを確認
lsof -i :3000

# 別のポートにマッピングして起動
docker container run -p 3001:3000 my-node-app
```

---

### エラー4: コンテナ内に入って調査する

```bash
# 起動中のコンテナに入る
docker container exec -it <コンテナ名またはID> /bin/sh
```

```bash
# コンテナ内で確認できること
ls /app          # ファイルがコピーされているか
cat /app/server.js   # ソースコードの内容
node --version   # Node.js のバージョン
```

```bash
# コンテナから抜ける
exit
```

---

### エラー5: イメージが古い / 変更が反映されない

ソースを変更しても古いイメージが使われることがあります。

```bash
# キャッシュを使わず再ビルド
docker image build --no-cache -t my-node-app .
```

---

## デバッグ用コマンド まとめ

```bash
# コンテナの状態を確認
docker container ls -a

# ログを確認
docker container logs <名前またはID>

# コンテナ内に入る
docker container exec -it <名前またはID> /bin/sh

# コンテナの詳細情報
docker container inspect <名前またはID>

# リソース使用状況を確認
docker container stats
```

---

## エラー再現用 — わざと失敗する Dockerfile

`bad-dockerfile/` フォルダで `docker image build` を試し、エラーメッセージの読み方を練習しましょう。

```bash
cd bad-dockerfile
docker image build -t bad-test .
```

エラーメッセージのどの部分に注目すべきか：
1. `Step X/Y :` → どのステップで失敗したか
2. `----> Running in ...` → 実行されたコマンド
3. 最後の `ERROR` 行 → 具体的なエラー内容
