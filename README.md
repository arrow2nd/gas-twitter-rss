# gas-twitter-rss

スプレッドシートに追加した単語を Twitter で定期検索して RSS で配信

## 記事

> [GAS + RSS でツイートを継続的にエゴサする](https://zenn.dev/arrow2nd/articles/0955d0135b5b75)

## できること

- Twitter の定期検索
- 特定ユーザーのツイートを除外
- 特定クライアントからのツイートを除外

## 使い方メモ

<details>
<summary>開く</summary>

### 1. スプレッドシートとスクリプトを作成

```txt
cd gas-twitter-rss

clasp create
? Create which script?
  standalone
  docs
❯ sheets <- これを選択
  slides
  forms
  webapp
  api
```

### 2. .clasp.json を編集

```jsonc
{
  ...
  "rootDir": "./src", // 変更
  ...
}
```

### 3. コードを push

```sh
# 不要なので削除
rm appsscript.json
clasp push
```

### 4. スクリプトのプロパティを設定

`clasp open` でブラウザでスクリプトエディタを開く。

次に、 `ファイル > プロジェクトのプロパティ` でモーダルを開き

![プロパティの設定](https://user-images.githubusercontent.com/44780846/154842832-9ce7f472-e4d9-43c8-a92a-60639e5d68c1.png)

`twitterToken` という名前で Twitter API v2 のベアラートークンを設定する。

### 5. スプレッドシートを編集する

![スプレッドシート](https://user-images.githubusercontent.com/44780846/154843125-f01e729f-54be-4656-8cd9-c96781bcd022.png)

[Google スプレッドシート](https://docs.google.com/spreadsheets/)に `gas-twitter-rss`という名前のシートが作成されているので、

いい感じに編集して、いい感じに値を追加しておく。

### 6. トリガーを設定する

![トリガー設定](https://user-images.githubusercontent.com/44780846/154843251-39099f5b-afe8-4992-b33d-49acbf8f5032.png)

実行する関数を `fetch` にしておく。

### 7. 公開して RSS リーダに登録

`公開 > ウェブアプリケーションとして導入` で公開。

その後表示される URL を任意の RSS リーダに追加して完了！

</details>
