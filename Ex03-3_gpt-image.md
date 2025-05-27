### タスク 3 : GPT-image-1 を使用した画像生成モデルの利用

[演習 1. 4 : 画像生成モデル gpt-image-1 のデプロイ](https://github.com/osamum/AOAI-first-step-for-Developer/blob/prv-image1/Ex01-4_gpt-image.md#%E6%BC%94%E7%BF%92-1-4---%E7%94%BB%E5%83%8F%E7%94%9F%E6%88%90%E3%83%A2%E3%83%87%E3%83%AB-gpt-image-1-%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4) でデプロイした gpt-image-1 モデルを使用してプロンプトから画像を生成します。

<br>

### タスク 3-1 : HTTP Client ツールによる呼び出しの確認

Azure OpenAI サービスの言語モデルの関数呼び出しを行う際にやり取りされるデータ構造を確認するために Visual Studio Code の REST Client 拡張を使用してリクエストを送信し、レスポンスを確認します。

手順は以下のとおりです。

1. [演習 3.1-2 : **HTTP Client ツールによる呼び出しの確認**](Ex03-1.md#%E3%82%BF%E3%82%B9%E3%82%AF-2-http-client-%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%AE%E7%A2%BA%E8%AA%8D) で作成した **helloML.http** ファイルを開きます

2. ファイルに以下の内容をコピーして貼り付け、変数 `@image-1_endpoint` と `@image-1_api_key` の値を、[演習 1. 4 : 画像生成モデル gpt-image-1 のデプロイ](Ex01-4_gpt-image.md#1-gpt-image-1-%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4) の手順で控えておいた API キーとエンドポイントに置き換えます。

    ```http
    ###gpt-image-1 モデルによる画像の生成
    @image-1_endpoint = メモしておいた gpt-image-1 モデルのエンドポイント URL を記述
    @image-1_api_key = メモしておいた gpt-image-1 モデルの API キーを記述

    POST {{dalle-endpoint}} HTTP/1.1
    Content-Type: application/json
    api-key: {{apiKey}}

    POST {{image-1_endpoint}} HTTP/1.1
    Content-Type: application/json
    Authorization: Bearer {{image-1_api_key}}

    {
         "prompt" : "次のキーワード「Agentic world が実現する世界」から連想する画像を生成し、画像の中央に 「The Agentic world」という文字を配置",
        "size" : "1024x1024",
        "quality" : "medium",
        "output_compression" : 100,
        "output_format" : "png",
        "n" : 1
    }
    ```
    リクエストで指定しているパラメーターはプロンプト(prompt)と画像のサイズ(size: 1024x1024,1024x1536,1536x1024)と枚数(n: 1 ～ 10)、品質(quality:low,medium,high)、画像のフォーマット(output_format:PNG,JPEG)、圧縮(output_compression: 0～100)です。

3. ファイルに記述されている POST の上に \[**Send Request**\] と表示されるのでクリックします

    ![gtp-image-1 へのリクエスト](images/sendRequest_gpt-image1.png)

    レスポンスが返るまでに数十秒かかるので、レスポンスが返るまでしばらく待ちます。

4. レスポンスが返ったら内容に生成された画像のデータが Base64 エンコードされた形式で含まれていることを確認します。

    ![gpt-image-1 のレスポンス](images/gpt-image1_response.png)

ここまでの手順で、gpt-image-1 モデルを呼び出して画像を生成することができました。

Base64 エンコードされた画像データは *.html ファイルでは以下のマークアップで、

```html
<img src="data:image/png;base64,ここにBase64エンコードされた画像データが入ります" />

```

*.md ファイルでは以下のマークアップで表示できますが、

```markdown
![画像の説明](data:image/png;base64,ここにBase64エンコードされた画像データが入ります)
```

他の一般的なアプリケーションでも使用できるようにするために、デコードして画像ファイルとして保存するコードを作成します。

<br>

### タスク 3-2 : Base 64 画像データのデコードと保存

Base64 エンコードされた画像データをデコードして画像ファイルとして保存するための関数を作成します。今回作成する関数は、演習用ボット アプリケーションに画像生成機能を統合する際にも使用されます。

具体的な手順は以下のとおりです。

\[手順\]

\[**手順**\]

1. [演習 3.1-2](Ex03-1.md#%E3%82%BF%E3%82%B9%E3%82%AF-2-http-client-%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%AE%E7%A2%BA%E8%AA%8D)  で作成したフォルダー **devPlayground** を Visual Studio Code で開きます

2. 関数を定義するためのファイルを作成します

    Visual Studio Code の画面左のツリービューからプロジェクトのルートが選択されている状態で \[**New File**\] アイコンをクリックして **imageDecode.js** という名前のファイルを作成します
    
    ![imageDecode.js ファイルの作成](images/vscode_newFile_imageDecode.png)

3. 記述する関数は言語モデルを使用して作成します

    Visual Studio Code の上部のメニュー \[**View**] - [**Terminal**] をクリックし、画面下部にターミナル画面が表示されるので、以下のコマンドを実行してチャットボット アプリケーションを起動します。

    ```bash
    node consoleBot.js
    ```

    ターミナル画面に `Prompt:` が表示されたら、以下のメッセージを入力して[**Enter**\] キーを押下します

    ```
    引数"base64Data"に渡されたBase 64 エンコードされたデータを png 形式の画像ファイルにデコードして保存し、保存したファイルパスを返り値として返す"saveImage" という名前の関数を Node.js で作成してください。なお、保存に使用するファイル名は現在の日付時刻からユニークなものを作成し、ファイルの保存先は既存のディレクトリ "./images"内になるようにファイル名と文字列結合してください。パスの記述は相対パスで構いません。
    ```

    キーボードの \[**Ctrl**\] + \[**C**\] キーを押下してチャットボットアプリを終了します。
    
    言語モデルが生成した **saveImage** 関数のコードをコピーして、作成した **imageDecode.js** ファイルに貼り付け、キーボードの \[**Ctrl**\] + \[**S**\] キーを押下して保存します。

    言語モデルが生成したコードにはおそらく以下のように `fs` モジュールと `path` モジュールのインポートが含まれているはずなので、

    ```javascript
    const fs = require('fs');
    const path = require('path');
    ```

    Visual Studio Code のコンソール画面で以下のコマンドを実行して、必要なモジュールをインストールします。

    ```bash
    npm install fs path
    ```
    (※) 処理の内容としては `path` モジュールを使用しなくても同様の処理が記述できますが、言語モデルが生成したコードには含まれているので、ここではそのまま使用します。

4. デコードした画像ファイルを保存するためのディレクトリを作成します

    Visual Studio Code の画面左のツリービューからプロジェクトのルートが選択されている状態で \[**New Folder**\] アイコンをクリックして **images** という名前のフォルダーを作成します。

    ![images フォルダーの作成](images/vscode_newFolder_imagea.png)

5. 作成した **imageDecode.js** ファイルを開き、以下のコードをファイルの最後に追加します。

    ```javascript
    const imageBase64 = '※ここにBase64エンコードされた画像データを貼り付け'; 

    saveImage(imageBase64).then((path) => {
        console.log('Image saved at:', path);
    }).catch((error) => {
        console.error('Error saving image:', error);
    });
    ```

    変数 `imageBase64` には、演習 3-1 で取得した Base64 エンコードされた画像データを貼り付けます。

6. Visual Studio Code のターミナル画面で以下のコマンドを実行して、作成した **imageDecode.js** ファイルを実行します。

    ```bash
    node imageDecode.js
    ```
    正しく実行されると、以下のように画像ファイルが保存されたパスが表示されます。

    ![imageDecode.js の実行結果](images/result_imgDecode.png)

    ファイルのパスをクリックすると保存された画像ファイルが Visual Studio Code のエディターで開きます。
    