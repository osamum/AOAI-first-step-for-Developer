# 演習 4.オプション 2 : Teams ボットへの画像認識機能の追加

この演習では、[演習 3.オプション : GTP モデルを使用した画像認識](Ex03-op-1.md#%E6%BC%94%E7%BF%92-3%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3--gtp-%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98) で追加した画像認識機能を Teams ボットから利用できるようにします。

作業内容としては、ユーザーが Microsoft Teams にメッセージを投稿する際に添付された画像の URL を取得し、[演習 3.オプション : GTP モデルを使用した画像認識](Ex03-op-1.md#%E6%BC%94%E7%BF%92-3%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3--gtp-%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98) で変更した AOAI/lm.js の **sendMessage** 関数の第 2 引数にセットする処理を記述するだけです。

なお、この演習を行うには以下の 2 つの演習を完了している必要があります。

* [演習 3.5 : 画像認識機能の追加](Ex03-5.md#%E6%BC%94%E7%BF%92-3%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3--gtp-%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98) 
* [演習 4.オプション 1 : Microsoft Teams へのインストール](Ex04-op-1.md)

## 作業内容の説明

### メッセージに添付された画像の URL の取得

ユーザーが Teams への投稿に添付したファイルの情報は、Bot Framework アプリケーション内では `context.activity.attachments` に配列として格納されます。この配列には添付ファイルのほかに、ユーザーが投稿した書式付きメッセージも含まれるため lenght が 0 になることはありません。そのため、添付ファイルがあるかどうかは `context.activity.attachments.length` が 1 より大きいかどうかで判定します。

```javascript
if (context.activity.attachments.length > 1) {
    // 添付ファイルがある場合の処理
}
```

また、書式付きメッセージは配列の最後に格納されるため、ループ処理でファイルの情報のみを取得する際には配列の最後の要素はスキップします。

```javascript
if (context.activity.attachments.length > 1) {
    // 添付ファイルがある場合の処理
    for(let cnt=0; cnt<attachments.length -1 ; cnt++) {
    // 添付ファイルの処理
    }
}
```

添付されているファイルへの URL は配列 `attachments` の各要素の `contentUrl` プロパティに格納されていますが、ファイルの実体はユーザーの OneDrive か SharePoint 上に存在していてアクセス権が必要であるため、この URL をそのまま GTP モデルに渡しても GTP モデルからアクセスすることができません。本来であればボット アプリケーション内でアクセストークンを取得し、そのアクセストークンを使って画像のデータを取得し Baes64 エンコードして言語モデルに渡す必要がありますが、この演習ではその処理を省略するため非永続で認証が不要な `content.downloadUrl` プロパティを使用します。

```javascript
if (context.activity.attachments.length > 1) {
    // 添付ファイルがある場合の処理
    let files = []; 
    for(let cnt=0; cnt<attachments.length -1 ; cnt++) {
    // 添付ファイルの処理
        files.push(attachments[cnt].content.downloadUrl);
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
    //ユーザーから送信されたメッセージの attachments を取得
    const attachments = context.activity.attachments;
    //Teams ボットは attachments に書式付きの投稿メッセージが含まれるため
    //ファイルが添付されている場合 length は 1 より大きくなる
    if (attachments && attachments.length > 1) {              
        let files = [];  
        //Teams ボットは attachments の最後に書式付きの投稿メッセージが含まれるため、最後の要素は無視
        for(let cnt=0; cnt<attachments.length -1 ; cnt++) {
        /*
        一次的にファイルにアクセス出来れば良いので非永続で認証が不要な downloadUrl プロパティを使用
        そのため、投稿時に貼り付けた画像には対応しない
        */
            files.push(attachments[cnt].content.downloadUrl);
        }
        //ファイルだけ送信されてきた場合には無視
        if(inputText) await context.sendActivity(MessageFactory.text(await lm.sendMessage(await rag.findIndex(inputText),files)));
    } else {
        await context.sendActivity(MessageFactory.text(await lm.sendMessage(await rag.findIndex(inputText))));
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

Bot Framework アプリケーションにおいて、ユーザーがメッセージに添付したファイルの情報が `context.activity.attachments` に配列として格納されるのは Teams に限らず [ボット チャネル](https://learn.microsoft.com/ja-jp/azure/bot-service/bot-service-channels-reference?view=azure-bot-service-4.0#activity-support-by-channel)がサポートするメッセージ プラットフォームで共通の動作ですが、Teams がその配列の中にファイルではなく書式付きの投稿メッセージも含めるといったように、メッセージプラットフォームによってはその動作が異なる場合があるので注意が必要です。

また、`context.activity.attachments` に配列に含まれるファイルの情報は画像ファイルに限らず添付された全てのファイルが含まれるので、ファイルの種類に応じて最適な処理を行うようにコードを記述することが重要です。

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

