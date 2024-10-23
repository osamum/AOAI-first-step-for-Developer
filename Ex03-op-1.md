# 演習 3.オプション : GTP モデルを使用した画像認識

Azure OpenAI サービスが提供する [GPT-4o、GPT-4o mini、GPT-4 Turbo](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/concepts/models?tabs=python-secure#gpt-4o-and-gpt-4-turbo) モデルはテキストと画像の両方を入力として受け入れることができるマルチモーダル バージョンを備えています。

具体的には、一回のリクエストにつき、20 MB 以下の画像を最大 10 枚まで認識し、その画像に関連するテキストを生成することができます。

この機能を使用して、画像を入力として受け取り、その画像に関連するテキストを生成するモデルを構築します。

この演習の内容は、ここまでの演習で準備したリソースを実施可能ですのでとくに追加の準備は必要ありません。

<br>

# タスク 1 :  HTTP Client ツールによる呼び出しの確認(画像認識)

Azure OpenAI サービスの言語モデルで画像認識を行う際にやり取りされるデータ構造を確認するために Visual Studio Code の REST Client 拡張を使用してリクエストを送信し、レスポンスを確認します。

手順は以下のとおりです。

[**手順**]

1. [演習 3.1-2 : **HTTP Client ツールによる呼び出しの確認**](Ex03-1.md#%E3%82%BF%E3%82%B9%E3%82%AF-2-http-client-%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%AE%E7%A2%BA%E8%AA%8D) で作成した **helloML.http** ファイルを開きます

2. ファイルに以下の内容をコピーして貼り付けます

    ```http
    ### GTP-4 モデルによる画像認識

    POST {{endpoint}} HTTP/1.1
    Content-Type: application/json
    api-key: {{apiKey}}

    {
        "messages": [
            {
                "role":"user",
                "content":[
                    {
	                    "type": "text",
	                    "text": "この画像を説明してください:"
	                },
	                {
	                    "type": "image_url",
	                    "image_url": {
                        "url": "https://osamum.github.io/publish/assets/steak.jpg"
                        }
                    } 
            ] 
            }
        ],
        "max_tokens": 100, 
        "stream": false 
    }
    ```

    認識させる画像は以下です。

    <img src="https://osamum.github.io/publish/assets/steak.jpg" width="300px">

3. ファイルに記述されている **POST** の上に \[**Send Request**\] と表示されるのでクリックします

    ![HTTP クライアントからのリクエストの送信](images/vscode_sendRequest.png)

    なお、レスポンスが返るまでに数秒かかる場合があります。

4. レスポンスが返ったら choices/message/content の中身を確認します

    ![画像認識結果レスポンスの確認](images/imgRecognize_ResultResponse.png)

    画像の内容を説明するメッセージが生成されていることを確認します。

ここまでの手順で Azure OpenAI サービスの言語モデルで画像を認識させる際の基本的なデータ構造とそのやり取りを確認しました。

GPT-4 モデルの画像認識機能は、複数枚数の画像の指定や以下のような Base 64 エンコードされた画像データの入力もサポートしています。

```
"type": "image_url",
"image_url": {
   "url": "data:image/jpeg;base64,<your_image_data>"
}
```

この機能を利用すると、ローカルファイルの画像もリクエストに含めることができます。

詳細については以下のドキュメントをご参照ください。

