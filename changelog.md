# Change log

## December 5, 2024

* Azure AI Studio の UI 画面ショットを最新のものに差し替えました。

* [演習 2.3 : 独自データの追加 - チャット プレイグランド画面から独自のデータを追加する](/Ex02-3.md#%E3%83%81%E3%83%A3%E3%83%83%E3%83%88-%E3%83%97%E3%83%AC%E3%82%A4%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E7%94%BB%E9%9D%A2%E3%81%8B%E3%82%89%E7%8B%AC%E8%87%AA%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B) の手順を `Upload files(Preview)` から `Azure Blob Storage(Preview)` の手順に変更しました。

* [演習 3. 5 : 画像認識機能の追加 - チャットボット アプリへの画像認識機能の統合](Ex03-5.md#%E3%82%BF%E3%82%B9%E3%82%AF-2---%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E3%83%9C%E3%83%83%E3%83%88-%E3%82%A2%E3%83%97%E3%83%AA%E3%81%B8%E3%81%AE%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98%E6%A9%9F%E8%83%BD%E3%81%AE%E7%B5%B1%E5%90%88) において、画像認識の際のリクエストへの detail プロパティの追加と説明コメントの追加を行いました。

    ```
    //トークンの消費量を抑えたい場合は detail プロパティを 'auto' から 'low' に変更
    _content.push({ type: 'image_url', image_url: { url: imageUrl, detail: 'auto' } });
    ```

* [ハンズオン終了後の目的別学習コンテンツ紹介](NextLearn.md) に **参考となるセッションビデオ** の項目を作成し、2024 年 11 月 27-28 日に開催された 「**AI-Ready Infra. Boot Camp ～ 拡張性のある AI 利用に向けた IT 基盤とは？ ～**」のセッションビデオへのリンクを追加しました。

## November 29, 2024

[ハンズオン終了後の目的別学習コンテンツ紹介](NextLearn.md) に **サービスの運用環境の構築について** の項目を作成し、以下のドキュメントへのリンクを追加しました。

* [基本 OpenAI エンドツーエンド チャット リファレンス アーキテクチャ](https://learn.microsoft.com/ja-jp/azure/architecture/ai-ml/architecture/basic-openai-e2e-chat)

* [ベースライン OpenAI エンドツーエンド チャット リファレンス アーキテクチャ](https://learn.microsoft.com/ja-jp/azure/architecture/ai-ml/architecture/baseline-openai-e2e-chat)

* [Azure OpenAI end-to-end baseline reference implementation](https://github.com/Azure-Samples/openai-end-to-end-baseline)


## November 06, 2024

演習で使用する Node.js のバージョンを v22.11.0 に変更しました。

* [要件 - Node.js](README.md#%E8%A6%81%E4%BB%B6) を更新
* [演習 4 : 演習用ボット アプリケーションのフレームワークへの移植 - 準備](Ex04-0.md#%E6%BA%96%E5%82%99) を更新

なお、v20.17.0 もしくは v20.18.0 の LTS バージョンでも動作の確認を行っています。

## October 28, 2024

* [演習 3. 5 : 画像認識機能の追加](/Ex03-5.md) を追加
* [演習 4.オプション 2 : Teams ボットへの画像認識機能の追加](/Ex04-op-2.md) を追加

これに伴い関係するページのメニューの追加とリンクの変更を行いました。