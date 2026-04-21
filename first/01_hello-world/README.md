# 01 — Hello World（Docker の動作確認）

Docker が正しくインストールされているか、`hello-world` イメージで確認します。

---

## 実行コマンド

```bash
docker container run hello-world
```

---

## 期待する出力

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
...
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

**「Hello from Docker!」が表示されれば成功です。**

---

## 何が起きているのか？

`docker container run` は、内部で以下の 3 ステップを一度に実行しています。

| ステップ | 説明 |
|---------|------|
| **pull** | ローカルに無ければ Docker Hub からイメージをダウンロード |
| **create** | イメージからコンテナの「器」を作成 |
| **start** | コンテナ内のプロセスを起動 |

初回はダウンロードがあるので時間がかかりますが、2回目以降はキャッシュが効いて一瞬です。

---

## 後片付け（任意）

`hello-world` コンテナは一度だけ出力して終了するタイプなので、一覧から停止済みとして残ります。

```bash
# 停止済みも含めて確認
docker container ls -a

# 停止済みコンテナをまとめて削除
docker container prune
```

---

## チェックポイント

- [ ] `docker --version` でバージョンが表示される
- [ ] `docker container run hello-world` で「Hello from Docker!」が表示される
- [ ] 2 回目の実行では pull が走らず、すぐに出力される
