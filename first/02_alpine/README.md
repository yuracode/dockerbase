# 02 — Alpine コンテナに入ってみる

軽量な Linux ディストリビューション「Alpine」のコンテナに入り、シェル操作を体験します。

---

## 実行コマンド

```bash
docker container run -it alpine /bin/sh
```

`/ #` のようなプロンプトが表示されたらコンテナの中に入れています。

---

## オプションの意味

| オプション | 意味 |
|-----------|------|
| `-i` | interactive — 標準入力を開いたままにする |
| `-t` | tty — 疑似ターミナルを割り当てる |
| `alpine` | 使用するイメージ名 |
| `/bin/sh` | コンテナ内で起動するコマンド（Alpine には bash が入っていないので sh） |

> `-i` と `-t` はほぼ必ずセットで使うため、`-it` とまとめて書きます。

---

## コンテナ内で試すコマンド

```sh
ls                      # ルート直下のファイル一覧
whoami                  # 現在のユーザ → root
pwd                     # 現在のディレクトリ → /
cat /etc/os-release     # OS情報 → Alpine Linux
uname -a                # カーネル情報
```

### ファイルを作ってみる

```sh
echo "Hello Container" > /tmp/memo.txt
cat /tmp/memo.txt
```

### 抜ける

```sh
exit
```

`exit` するとシェルが終了し、**コンテナも停止**します（シェルがメインプロセスだったため）。

---

## 気づきポイント

- コンテナの中は**独立した Linux 環境**
- ホストPCとはファイルシステムも分離されている
- コンテナ内で作ったファイル（`/tmp/memo.txt`）は、`exit` 後そのコンテナを削除すると消える
- 同じ Alpine コンテナをもう一度 `run` すると、**まっさらな新しいコンテナ**が起動する

---

## 停止したコンテナを確認する

```bash
# 停止済みも含めて一覧表示
docker container ls -a
```

`STATUS` が `Exited` の Alpine コンテナが残っているはずです。

---

## チェックポイント

- [ ] `docker container run -it alpine /bin/sh` でシェルに入れる
- [ ] `whoami` が `root` を返す
- [ ] `cat /etc/os-release` で Alpine と表示される
- [ ] `exit` で抜けられる
