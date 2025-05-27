# 演習 2. オプション : Azure AI Foundry で作成したチャットボットを Azure App Service にデプロイ

Azure AI Foundry のチャット プレイグランドで動作しているチャットボットを Web アプリや Teams アプリ、Copilot Studio の新しい Copilot としてデプロイすることができます。

この手順では Web アプリとして Azure App Service にデプロイします。

具体的な手順は以下のとおりです。

\[**手順**\]

1. Azure OpanAI Studio のチャット プレイグランド画面上部のメニューから \[**デプロイ**\] - \[**...Web アプリとして**\] をクリックします

    ![チャット プレイグランドからの RAG アプリのデプロイ](images/AOAIStudio_ChatPlayGround_Deploy.png)

2. \[**Web アプリにデプロイ**\] ダイアログボックスが表示されるので、各項目を以下のように設定します

    |  項目  |  値  |
    | ---- | ---- |
    |  **名前 \***  |  任意のユニークなもの  |
    |  **サブスクリプション \***  |  任意のサブスクリプション  |
    |  **リソースグループ \***  |  任意のリソース グループ  |
    |  **場所 \***  |  任意のリージョン  |
    |  **価格プラン\***  |  F1 Free  |
    |  **Web アプリでチャット履歴を有効にする**  |  任意  |

    ![Web にデプロイ ダイアログボックス](images/AOAIStudio_DeployWebDialog.png)

     \[**デプロイ**\] ボタンをクリックすると、Azure App Service にデプロイが開始されるので完了するまで待ちます

3. デプロイが完了すると、\[**起動**\] ボタン表示されるのでクリックします

    ![デプロイ完了](images/AOAIStudio_LaunchWebAppButton.png)

4. Web ブラウザーが起動し、\[**要求されているアクセス許可**\] ダイアログボックスが表示されるので \[**承諾**\] ボタンをクリックします

    Azure App Service にデプロイしたチャットボットが表示されるので任意の質問を入力し、紙飛行機のアイコン(\[**送信**\] ボタン)をクリックして回答が返ることを確認します

    ![Chatbot on Azure App Service](images/AOAIStudio_Deployed_appService.png)

    また、[演習2.3](Ex02-3.md#%E3%83%81%E3%83%A3%E3%83%83%E3%83%88-%E3%83%97%E3%83%AC%E3%82%A4%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E7%94%BB%E9%9D%A2%E3%81%8B%E3%82%89%E7%8B%AC%E8%87%AA%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B) で追加したデータも回答として返ることを確認してください。
    
    この Web アプリケーションは Azure App Service の自動認証が有効になっており、Azure Active Directory よって保護されています。そのため同じ Azure Active Directory テナントにログインしているユーザーだけが使用することができます。

ここまでの手順で、Azure AI Foundry で作成したチャットボットを Azure App Service にデプロイし、Web ブラウザーを介してユーザーがアクセスできるようになりました。

この機能の詳細については以下のドキュメントをご参照ください。

* [**Azure OpenAI Web アプリを使う**](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/use-web-app)

<br>

## 次のステップ

👉 [**演習 3: Azure Open AI サービスとアプリケーションの統合**](Ex03-0.md)

<br>

<hr>

👈 [**演習 2. 3 : 独自データの追加**](Ex02-3.md)

🏚️ [README に戻る](README.md)
