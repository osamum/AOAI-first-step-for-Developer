const { AzureOpenAI } = require("openai");
//[PLACEHOLDER:require @azure/search-documents]

const dotenv = require("dotenv");
dotenv.config();

const embedding_endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const embedding_apiKey = process.env["AZURE_OPENAI_API_KEY"];
const embedding_deployment = "埋め込みモデルのデプロイメント名を記述";
const apiVersion = "2024-06-01"; 

//[PLACEHOLDER: load AI search valiables]

//埋め込みモデルのクライアントを作成
const embeddingClient = new AzureOpenAI({embedding_endpoint,embedding_apiKey,apiVersion,deployment: embedding_deployment});
//[PLACEHOLDER: new searchClient]

//テキストをベクトルデータに変換する関数
async function getEmbedding(text) {
    const embeddings = await embeddingClient.embeddings.create({ input: text, model: ''});
    return embeddings.data[0].embedding;
}

//[DELETE: after embedding test]
getEmbedding('やまたのおろち製作所の所在地はどこですか？')
    .then(embedding => console.log(embedding));


    