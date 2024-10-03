//ライブラリの参照
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();
const  myFunctions  = require('./funcs');
const imageGen = require('./imgGen');

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const apiKey = process.env["AZURE_OPENAI_API_KEY"] ;
const apiVersion = "2024-05-01-preview";
const deployment = "※ここに言語モデルのデプロイメント名を記述してください"; 
//言語モデルとユーザーの会話を保持するための配列
var messages = [
    { role: "system", content: "You are an useful assistant." },
];
//会話を保持する配列の限度
const messagesLength = 10;

//Azure OpenAI にメッセージを送信する関数
async function sendMessage(message) {
    if(message) addMessage({ role: 'user', content: message });
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
    const result = await client.chat.completions.create({
        messages: messages,
        model: "",
        tools: tools,
    });

    for (const choice of result.choices) {
        if (choice.message.tool_calls) {
            return sendFunctionResult(choice.message);
        }else{
            const resposeMessage = choice.message.content;
            addMessage({ role: 'assistant', content: resposeMessage });
            return resposeMessage;
        }
    }
}

//保持する会話の長さを調整する関数
function addMessage(message) {
    if(messages.length >= messagesLength) messages.splice(1,1);
    messages.push(message);
}

module.exports = {sendMessage};

// tools スキーマの設定
const tools = [
    {
        type: 'function',
        function: {
            name: 'get_GitHubUser_info',
            description: 'GitHub アカウントの情報を返す',
            parameters: {
                type: 'object',
            properties: {
                userName: {
                    type: 'string',
                    description: 'GitHub のユーザー名、アカウント名、もしくは ID',
                }
            },
                required: ['userName'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'get_current_date_time',
            description: '現在のシステム時刻を返します。この関数は引数は必要ありません',
            parameters: {
                type: 'object',
                properties: {},
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'generate_image',
            description: '指定されたプロンプトに基づいて画像を生成します',
            parameters: {
                type: 'object',
                properties: {
                    prompt: {
                        type: 'string',
                        description: '生成したい画像の概要を指定します。例: "恰好良いオートバイのイラストを描いてください"'
                    }
                },
                required: ['prompt']
            }
        }
    },
];

//実際の関数を呼び出す
async function routingFunctions(name, args) {
    switch (name) {
        case "get_GitHubUser_info":
            return JSON.stringify(await myFunctions.getGitHubUserinfo(args.userName));
        case "get_current_date_time":
            return await myFunctions.getCurrentDatetime();
            case "generate_image":
                console.log("\nAI : 画像を生成しています。この処理には数秒かかる場合があります。");
                return await imageGen.ganarateImage(args.prompt);
        default:
        
        return '要求を満たす関数がありませんでした。';
    }
}

//アプリケーション内で実行した関数の結果を言語モデルに返す
async function sendFunctionResult(returnMessage){
    const toolCall = returnMessage.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);
    const functionResponse = await routingFunctions(toolCall.function.name, args);

    addMessage({
      role: "function",
      name: toolCall.function.name,
      content: functionResponse,
    });
    return await sendMessage();
}