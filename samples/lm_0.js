//ライブラリの参照
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();
//[PLACEHOLDER:require funcs.js]
//[PLACEHOLDER:require imgGen.js] 

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const apiKey = process.env["AZURE_OPENAI_API_KEY"] ;
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o-mini"; 
//言語モデルとユーザーの会話を保持するための配列
var messages = [
    { role: "system", content: "You are an useful assistant." },
];
//保持する会話の個数
const messagesLength = 10;

//Azure OpenAI にメッセージを送信する関数
async function sendMessage(message) {
    if(message) addMessage({ role: 'user', content: message });
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
    const result = await client.chat.completions.create({
        messages: messages,
        model: "",
        //[PLACEHOLDER:functionCalling tools:]
    });

    for (const choice of result.choices) {
        //[REPLACE:functionCalling if{}]
        const resposeMessage = choice.message.content;
        addMessage({ role: 'assistant', content: resposeMessage });
        return resposeMessage;
    }
}

//保持する会話の個数を調整する関数
function addMessage(message) {
    if(messages.length >= messagesLength) messages.splice(1,1);
    messages.push(message);
}

//[DELETE:Integration lm.js]
//結果を確認するための即時実行関数
(async () => {
    const message = 'あなたに誕生日はありますか?';
    const reply = await sendMessage(message);
    console.log(reply);
})();