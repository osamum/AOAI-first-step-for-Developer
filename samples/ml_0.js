//ライブラリの参照
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

//[PLACEHOLDER:require funcs.js]

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const apiKey = process.env["AZURE_OPENAI_API_KEY"] ;
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o-mini"; 
//言語モデルとユーザーの会話を保持するための配列
var messages = [
    { role: "system", content: "You are an useful assistant." },
];

//Azure OpenAI にメッセージを送信する関数
async function sendMessage(message) {
    if(message) messages.push({ role: 'user', content: message });
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
    const result = await client.chat.completions.create({
        messages: messages,
        model: "",
        //[PLACEHOLDER:functionCalling tools:]
    });

    for (const choice of result.choices) {

        //[REPLACE:functionCalling if{}]
        return choice.message.content;
    }
}

//[DELETE:Integration ml.js]
//結果を確認するための即時実行関数
(async () => {
    const message = 'あなたに誕生日はありますか?';
    const reply = await sendMessage(message);
    console.log(reply);
})();