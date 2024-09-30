const { AzureOpenAI } = require("openai");
const z = require("zod");
const {zodResponseFormat} = require("openai/helpers/zod");

const dotenv = require("dotenv");
dotenv.config();

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiVersion = "2024-08-01-preview";
const deployment = "ここにモデルのデプロイ名を記述";


const Step = z.object({
    explanation: z.string()
})

const Ingredients =z.object({
    material_name: z.string()
})

const RecepiResponse = z.object({
    dish_name: z.string(),
    steps: z.array(Step),
    ingredients: z.array(Ingredients)
})


var messages = [
    { role: 'system', content: 'あなたは料理教室のアシスタントです。講師から与えられたレシピをJSONにして答えます' }
];

//Azure OpenAI にメッセージを送信する関数
async function sendMessage(message) {
    if (message) messages.push({ role: 'user', content: message });
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
    const result = await client.beta.chat.completions.parse({
        messages: messages,
        response_format: zodResponseFormat(RecepiResponse, 'RecepiResponse'),
    });

    const resposeMsg = result.choices[0]?.message;
    if (resposeMsg?.parsed) {
        console.log(resposeMsg.parsed);
        //console.log(JSON.stringify(resposeMsg.parsed));

    } else {
        console.log(resposeMsg.refusal);
    }
}

const message = 'ゆで卵の作り方について説明します。\n' 
    + '材料は、玉子、水、塩、お酢です。\nまず、卵がすっぽりつかるくらいの水を鍋に入れ火をつけ、沸騰したら酢を入れます。\n' 
    + '2分ほど菜箸で卵を転がした後、好みの固さになる時間までゆでます。半熟なら6～8分、固ゆでなら10～13分が目安です。\n' 
    + 'ゆで終わったら、すぐに冷水に入れて冷やし、殻がむきやすい状態にします。';

sendMessage(`content:${message}`);
