# 演習 4.オプション 2 : Teams ボットへの画像認識機能の追加

この演習では、[演習 3.オプション : GTP モデルを使用した画像認識](Ex03-op-1.md#%E6%BC%94%E7%BF%92-3%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3--gtp-%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98) で追加した画像認識機能を Teams ボットから利用できるようにします。

作業内容としては、ユーザーが Microsoft Teams にメッセージを投稿する際に添付された画像の URL を取得し、[演習 3.オプション : GTP モデルを使用した画像認識](Ex03-op-1.md#%E6%BC%94%E7%BF%92-3%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3--gtp-%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98) で変更した AOAI/lm.js の **sendMessage** 関数の第 2 引数にセットする処理を記述するだけです。

なお、この演習を行うには以下の 2 つの演習を完了している必要があります。

* [演習 3.5 : 画像認識機能の追加](Ex03-5.md#%E6%BC%94%E7%BF%92-3%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3--gtp-%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98) 
* [演習 4.オプション 1 : Microsoft Teams へのインストール](Ex04-op-1.md)

## 作業内容の説明

### メッセージに添付された画像の URL の取得

ユーザーが Teams への投稿に添付したファイルの情報は、Bot Framework アプリケーション内では `context.activity.attachments` に配列として格納されます。この配列には添付ファイルのほかに、ユーザーが投稿した書式付きメッセージも含まれるため配列の各要素の `content.fileType` プロパティを使用してファイルの種類が画像であるかどうかを判別する必要があります。

```javascript
//attachments を列挙
for (const attach of context.activity.attachments) {
    //添付されたファイルが画像の場合は files 配列に追加
    let fileType = attach.content.fileType;
    if (/^(jpg|jpeg|png|gif)$/i.test(fileType)) {
        //画像ファイルの場合の処理
    }    
}
```

添付されているファイルへの URL は配列 `attachments` の各要素の `contentUrl` プロパティに格納されていますが、ファイルの実体はユーザーの OneDrive か SharePoint 上に存在していてアクセス権が必要であるため、この URL をそのまま GTP モデルに渡しても GTP モデルからアクセスすることができません。本来であればボット アプリケーション内でアクセストークンを取得し、そのアクセストークンを使って画像のデータを取得し Baes64 エンコードして言語モデルに渡す必要がありますが、この演習ではその処理を省略するため非永続で認証が不要な `content.downloadUrl` プロパティを使用します。

```javascript
//attachments を列挙
for (const attach of context.activity.attachments;) {
    //添付されたファイルが画像の場合は files 配列に追加
    let fileType = attach.content.fileType;
    if (/^(jpg|jpeg|png|gif)$/i.test(fileType)) {
        //画像ファイルの場合の処理
        files.push(attach.content.downloadUrl);
    }    
}
```

`downloadUrl` プロパティに格納されている非永続性の URL 配列を **lm.js** の **sendMessage** 関数の第 2 引数にセットすることで、画像認識機能を Teams ボットから利用できるようになります。

だだし、この実装ではユーザーが Teams のメッセージ UI に添付したファイルに対しての処理は可能ですが、クリップ ボードから貼り付けた画像に対しては処理を行うことができません。クリップ ボードから貼り付けた画像に対しても処理を行いたい場合は認証処理を追加し、`contentUrl` プロパティを使用して画像データを取得する必要があります。

上記の内容を踏まえ、実際の作業手順は以下の通りです。

\[**手順**\]

1. Visual Studio Code で [演習 4 : 演習用ボット アプリケーションのフレームワークへの移植](Ex04-0.md) で作成した Bot Framework アプリケーションのプロジェクトを開きます

2. ファイル **bot.js** の **onMessage** ハンドラーの内容を以下のコードに置き換えます。

    ```javascript
    let files = [];
    const inputText = context.activity.text;
    //ユーザーから送信されたメッセージの attachments を取得
    const attachments = context.activity.attachments;
    //attachments を列挙
    for (const attach of attachments) {
        //添付されたファイルが画像の場合は files 配列に追加
        let fileType = attach.content.fileType;
        if (/^(jpg|jpeg|png|gif)$/i.test(fileType)) files.push(attach.content.downloadUrl);
    }
    //ファイルだけ送信されてきた場合には無視
    if (inputText) {
        await context.sendActivity(MessageFactory.text(await lm.sendMessage(await rag.findIndex(inputText), files)));
    }
    await next();
    ```

    コードの変更が完了したらキーボードの \[Ctrl\] + \[S\] キーを押下して保存します。

3. Visual Studio Code の画面左のツールバーから Azure アイコンをクリックします

    表示された \[RESOURCES\] セクションの Azure ツリーから \[App Service\] を展開し、[演習 4-2 : ボット アプリケーションへの ID 設定と Azure App Service へのデプロイ](https://github.com/osamum/AOAI-first-step-for-Developer/blob/img-recog/Ex04-2.md#%E3%82%BF%E3%82%B9%E3%82%AF-2--%E3%83%9C%E3%83%83%E3%83%88-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%B8%E3%81%AE-id-%E8%A8%AD%E5%AE%9A%E3%81%A8-azure-app-service-%E3%81%B8%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4) でアプリケーションをデプロイした App Service リソース右クリックし、表示されたコンテキスト \[**Deploy to Web App..**\] をクリックしてデプロイを実行します

    ![ボットアプリケーションの再デプロイ](images/VSCode_deployWebApp.png)

4. デプロイが完了したら、Teams にログインし、[演習 4.オプション : Microsoft Teams へのインストール](Ex04-op-1.md) でインストールしたボットとのチャット開き、ローカルにある画像ファイルを添付してメッセージを送信します

    送信したメッセージに対して画像認識機能が正常に動作していることを確認します。

    ![Teams ボットでの画像認識](images/teams_imgeRecog.png)


ここまでの手順で、Teams ボットから画像認識機能を利用できるようになりました。

<br>

## まとめ

この演習では、[演習 3.オプション : GTP モデルを使用した画像認識](Ex03-op-1.md#%E6%BC%94%E7%BF%92-3%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3--gtp-%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98) で追加した画像認識機能を Teams ボットから利用できるようにしました。


<br>

## 参考資料

* [Bot Framework SDK を使用してメディア添付ファイルを送信する - Bot Service](https://learn.microsoft.com/ja-jp/azure/bot-service/bot-builder-howto-add-media-attachments?view=azure-bot-service-4.0&tabs=javascript)

* [ボットを使用してファイルを送受信する - Teams](https://learn.microsoft.com/ja-jp/microsoftteams/platform/bots/how-to/bots-filesv4)

* [Handling Attachments - microsoft/BotBuilder-Samples](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/javascript_nodejs/15.handling-attachments)

<br>

## 次へ

👉 [**ハンズオン終了後の目的別学習コンテンツ紹介**](NextLearn.md)

<br>

<hr>

👈 [**演習 4.オプション 1 : Microsoft Teams へのインストール** ](Ex04-op-1.md)

🏚️ [README に戻る](README.md)

