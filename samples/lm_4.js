//ライブラリの参照
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();
const myFunctions = require('./funcs');
const imageGen = require('./imgGen');

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiVersion = "2025-04-01-preview";
const deployment = "gpt-4o-mini";
//言語モデルとユーザーの会話を保持するための配列
var messages = [
    { role: "system", content: "You are an useful assistant." },
];
//保持する会話の個数
const messagesLength = 10;

//Azure OpenAI にメッセージを送信する関数
async function sendMessage(message, imageUrls) {
    
    let body;
    if (imageUrls && imageUrls.length > 0) {
        /*
        画像が指定されていたら、リクエストの message 要素の content の内容を以下のように作成
        content: [{type:'text', text: message},{type:'image_url',image_url:{ur:imageUrl}},{複数画像の場合}] };
        */
        let _content = [];
        _content.push({ type: 'text', text: message });
        for (const imageUrl of imageUrls) {
            _content.push({ type: 'image_url', image_url: { url: imageUrl } });
        }
        message = { role: 'user', content: _content };
        body = { messages: [message], max_tokens: 100, stream: false };
    } else {
        if (message) addMessage({ role: 'user', content: message });
        body = {
            messages: messages, tools: tools, tool_choice: 'auto'
        }
    }

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
    const result = await client.chat.completions.create(body);

    for (const choice of result.choices) {
        if (choice.message.tool_calls) {
            return sendFunctionResult(choice.message);
        } else {
            const resposeMessage = choice.message.content;
            addMessage({ role: 'assistant', content: resposeMessage });
            return resposeMessage;
        }
    }
}

//保持する会話の個数を調整する関数
function addMessage(message) {
    if (messages.length >= messagesLength) messages.splice(1, 1);
    messages.push(message);
}

module.exports = { sendMessage };

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
    //追加された箇所 ↓
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
            console.log('get_GitHubUser_info');
            return JSON.stringify(await myFunctions.getGitHubUserinfo(args.userName));
        case "get_current_date_time":
            return await myFunctions.getCurrentDatetime();
        //追加された箇所 ↓
        case "generate_image":
            console.log("\nAI : 画像を生成しています。この処理には数秒かかる場合があります。");
            return await imageGen.generateImage(args.prompt);
        default:
            return '要求を満たす関数がありませんでした。';
    }
}

//アプリケーション内で実行した関数の結果を言語モデルに返す
async function sendFunctionResult(returnMessage) {
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
