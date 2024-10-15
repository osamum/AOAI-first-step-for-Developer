const { AzureOpenAI } = require("openai");
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

const dotenv = require("dotenv");
dotenv.config();

const embedding_endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const embedding_apiKey = process.env["AZURE_OPENAI_API_KEY"];
const embedding_deployment = "text-embedding-ada-002";
const apiVersion = "2024-06-01"; 

const search_endpoint = process.env["SEARCH_ENDPOINT"];
const search_apiKey = process.env["SEARCH_API_KEY"];
const search_indexName = 'ここにインデックス名を記述';

//Azure AI Search のクライアントを作成
const searchClient = new SearchClient(search_endpoint, search_indexName, new AzureKeyCredential(search_apiKey));

//埋め込みモデルのクライアントを作成
const embeddingClient = new AzureOpenAI({embedding_endpoint,embedding_apiKey,apiVersion,deployment: embedding_deployment});
//[PLACEHOLDER: new searchClient]

//テキストをベクトルデータに変換する関数
async function getEmbedding(text) {
    const embeddings = await embeddingClient.embeddings.create({ input: text, model: ''});
    return embeddings.data[0].embedding;
}

//問い合わせメッセージを受け取って検索を実行す
async function findIndex(queryText) {
    const thresholdScore = 5.5;
    const embedding = await getEmbedding(queryText);
    const result = await searchWithVectorQuery(embedding, queryText);
    //スコアがしきい値以上の場合は、検索結果を付加して言語モデルに回答の生成を依頼するメッセージを返す
    //意図した判断とならない場合は、console.log(result.score) でスコアを確認して thresholdScore の値を調整
    if (result != null && result.score >= thresholdScore) {
        return `以下の [question] の内容に対し、[content]の内容を使用して回答してください\n\n[question]\n${queryText}\n\n[content]\n${result.document.content}`
    } else {
        return queryText;
    }    
}

// ベクトル化されたクエリを使用して検索を実行
async function searchWithVectorQuery(vectorQuery, queryText) {
    const searchResults = await searchClient.search(queryText, {
        vector: {
            fields: ["contentVector"],
            kNearestNeighborsCount: 3,
            value: vectorQuery,
        },
    });
    for await (const result of searchResults.results) {
        // クエリベクトルに最も近いものを返す
        return result;
    }
}

//[DELETE: after search test]
findIndex('やまたのおろち製作所の所在地はどこですか？')
    .then(result => console.log(result));


//module.exports = { findIndex };