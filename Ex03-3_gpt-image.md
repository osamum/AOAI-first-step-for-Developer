### タスク 3 : GPT-image-1 を使用した画像生成モデルの利用

[演習 1. 4 : 画像生成モデル gpt-image-1 のデプロイ](https://github.com/osamum/AOAI-first-step-for-Developer/blob/prv-image1/Ex01-4_gpt-image.md#%E6%BC%94%E7%BF%92-1-4---%E7%94%BB%E5%83%8F%E7%94%9F%E6%88%90%E3%83%A2%E3%83%87%E3%83%AB-gpt-image-1-%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4) でデプロイした gpt-image-1 モデルを使用してプロンプトから画像を生成します。

<br>

### タスク 3-1 : HTTP Client ツールによる呼び出しの確認 (画像の生成)

Azure OpenAI サービスの言語モデルの関数呼び出しを行う際にやり取りされるデータ構造を確認するために Visual Studio Code の REST Client 拡張を使用してリクエストを送信し、レスポンスを確認します。

この演習では、gpt-image-1 モデルを使用してプロンプトから画像を生成するリクエストを送信し、レスポンスとして返される Base64 エンコードされた画像データを確認します。

手順は以下のとおりです。

\[**手順**\]

1. [演習 3.1-2 : **HTTP Client ツールによる呼び出しの確認**](Ex03-1.md#%E3%82%BF%E3%82%B9%E3%82%AF-2-http-client-%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%AE%E7%A2%BA%E8%AA%8D) で作成した **helloML.http** ファイルを開きます

2. ファイルに以下の内容をコピーして貼り付け、変数 `@image-1_gen_endpoint` と `@image-1_api_key` の値を、[演習 1. 4 : 画像生成モデル gpt-image-1 のデプロイ](Ex01-4_gpt-image.md#1-gpt-image-1-%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4) の手順で控えておいた API キーとエンドポイントに置き換えます。

    ```http
    ###gpt-image-1 モデルによる画像の生成
    @image-1_gen_endpoint = メモしておいた gpt-image-1 モデルのエンドポイント URL を記述
    @image-1_api_key = メモしておいた gpt-image-1 モデルの API キーを記述

    POST {{image-1_gen_endpoint }} HTTP/1.1
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

*.md ファイルでは以下のマークアップで表示できます。

```markdown
![画像の説明](data:image/png;base64,ここにBase64エンコードされた画像データが入ります)
```
ここまでの手順で Azure OpenAI サービスの GPT-image-1 モデルで画像を生成する際の基本的なデータ構造とそのやり取りを確認しました。

なお、GPT-image-1 モデルの呼び出し方についての詳細は以下のドキュメントをご参照ください。

* [Azure OpenAI イメージ生成モデルを使用する方法](https://learn.microsoft.com/ja-jp/azure/cognitive-services/openai/concepts/gpt-image-1)


<br>

### タスク 3-2 : Base 64 画像データのデコードと保存

前述したように gpt-image-1 モデルが返す Baes64 エンコードされた画像データは、HTML や Markdown ファイルで表示することができますが、実際に画像ファイルとして保存して利用するためには、Base64 エンコードされたデータをデコードして画像ファイルとして保存する必要があります。

このタスクでは Base64 エンコードされた画像データをデコードして画像ファイルとして保存するための関数を作成します。今回作成する関数は、演習用ボット アプリケーションに画像生成機能を統合する際にも使用されます。

具体的な手順は以下のとおりです。

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
    //動作確認用のコード 
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

    ファイルのパスをクリックすると保存された画像ファイルが Visual Studio Code のエディターで開くので内容を確認します。

    ![保存された画像ファイルの確認](images/generatedImg_GPTimage-1.png)

    正しく画像が生成されていることを確認できたら、ターミナル画面で \[**Ctrl**\] + \[**C**\] キーを押下して imageDecode.js の実行を終了し、**前の手順で追加した確認用のコードを削除して** imageDecode.js ファイルを保存してください。

7. 作成した **imageDecode.js** ファイルを他のファイルから使用できるようにするために、以下のコードをファイルの先頭に追加します。

    ```javascript
    // 関数をエクスポート
    module.exports = {saveImage};
    ```

ここまでの手順で、Bsase64 エンコードされた画像データをデコードして画像ファイルとして保存する関数を作成し、動作を確認することができました。
    
もし、うまくいかない場合は以下のコードを参考にしてください。

```javascript
const fs = require('fs');

async function saveImage(base64Data) {
  // Base64 データをバイナリデータに変換
  const binaryData = Buffer.from(base64Data, 'base64');
  const fileName = new Date().toISOString().replace(/[:.]/g, '-') + '.png';
  const savePath = './images/' + fileName;

  // バイナリデータを PNG 画像ファイルとして保存
  fs.writeFileSync(savePath, binaryData);
  return savePath;
}

// 関数をエクスポート
// (他のファイルからこの関数を使用できるようにするため)
module.exports = {saveImage};

//動作確認用のコード 
const imageBase64 = ''; // ここにBase64エンコードされた画像データを入力

saveImage(imageBase64).then((path) => {
  console.log('Image saved at:', path);
}).catch((error) => {
  console.error('Error saving image:', error);
});
```

<br>

### タスク 3-3 : HTTP Client ツールによる呼び出しの確認 (画像の編集)

gpt-image-1 モデルはテキストのプロンプトによる画像の生成だけでなく、既存の画像を送信し、編集することもできます。このタスクでは、前の手順で生成した画像を使用して、画像の編集を行うリクエストの内容の確認と、レスポンスされる内容を確認します。

具体的な手順は以下のとおりです。

\[**手順**\]

1. [演習 1. 4 : 画像生成モデル gpt-image-1 のデプロイ](Ex01-4_gpt-image.md#1-gpt-image-1-%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4) の手順で控えておいたエンドポイントのクエリーストリングの直前のディレクトリ名 `generations`　を `edits` に変更します。
    例えば、以下のように変更します。

    \[変更前\]
    
    https://\<your-resource-name\>.cognitiveservices.azure.com/openai/deployments/gpt-image-1/**generations**?api-version=2025-04-01-preview
    

    \[変更後\]
    
    https://\<your-resource-name\>.cognitiveservices.azure.com/openai/deployments/gpt-image-1/**edits**?api-version=2025-04-01-preview
    

2. [演習 3.1-2 : **HTTP Client ツールによる呼び出しの確認**](Ex03-1.md#%E3%82%BF%E3%82%B9%E3%82%AF-2-http-client-%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%AE%E7%A2%BA%E8%AA%8D) で作成した **helloML.http** ファイルを開きます

3. ファイルに以下の内容をコピーして貼り付け、変数 `@image-1_edit_endpoint` の内容を前の手順で変更したエンドポイントに置き換えます。

    ```http
    ### gpt-image-1 モデルによる画像の編集
    @image-1_edit_endpoint = 編集した gpt-image-1 モデルのエンドポイント URL を記述
    @upload_filePath = ./images/画像のファイル名

    POST {{image-1_edit_endpoint}} HTTP/1.1
    Content-Type: multipart/form-data; boundary=boundary
    Authorization: Bearer {{image-1_api_key}}

    --boundary
    Content-Disposition: form-data; name="prompt"

    添付の画像をより写実的にしてください
    --boundary
    Content-Disposition: form-data; name="size"

    1024x1024
    --boundary
    Content-Disposition: form-data; name="n"

    1
    --boundary
    Content-Disposition: form-data; name="quality"

    medium
    --boundary
    Content-Disposition: form-data; name="image"; filename="example.png"
    Content-Type: image/png

    < {{upload_filePath}}
    --boundary--
    ```

4. ファイルに記述されている POST の上に \[**Send Request**\] と表示されるのでクリックします

    ![gtp-image-1 へのリクエスト](images/sendRequest_gpt-image1.png)

    レスポンスが返るまでに数十秒かかるので、レスポンスが返るまでしばらく待ちます。

4. レスポンスが返ったら、内容に生成された画像のデータが Base64 エンコードされた形式で含まれていることを確認し、エンコード データをコピーします。
   
   前のタスクで作成した **imageDecode.js** ファイルを開き、変数 `imageBase64` の値をコピーした Base64 エンコードされた画像データに書き換えます。

5. Visual Studio Code のターミナル画面で以下のコマンドを実行して、作成した **imageDecode.js** ファイルを実行します。

    ```bash
    node imageDecode.js
    ```

    正しく実行されると、以下のように画像ファイルが保存されたパスが表示されます。

    ![imageDecode.js の実行結果](images/result_imgDecode.png)

    ファイルのパスをクリックすると保存された画像ファイルが Visual Studio Code のエディターで開くので内容を確認します。

    ![編集された画像ファイルの確認](images/editedImg_GPTimage-1.png)

6. ターミナル画面で \[**Ctrl**\] + \[**C**\] キーを押下して imageDecode.js の実行を終了し、これからの作業での誤動作を防ぐために**前の手順で追加した確認用のコードを削除して**ください。その後、キーボードの \[**ctrl**\] + \[**S**\] を押下して imageDecode.js ファイルを保存してください。

ここまでの手順で、gpt-image-1 モデルを使用して画像の編集を行う際のリクエストとレスポンスの確認ができました。


これらの機能については上記ドキュメントを参照してください。

* [Azure OpenAI イメージ生成モデルを使用する方法 - Image Edit API を呼び出す](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/dall-e?tabs=gpt-image-1#call-the-image-edit-api)

<br>