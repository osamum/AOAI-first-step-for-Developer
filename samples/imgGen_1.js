const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const endpoint = process.env["IMAGE_GEN_ENDPOINT"];
const apiKey = process.env["IMAGE_GEN_KEY"];
const imageDecode = require('../imgDecode');

//画像生成モデルのサービスを呼び出し、デコードして保存した画像のパスを返す
async function generateImage(prompt) {
    let result = {};
    try {
        result.filePath = imageDecode.saveImage(await apiCall_generateImage(prompt));
        result.status = 'success';
    }
    catch (err) {
        result.errorMessage = err.message;
        result.status = 'error';
        
    } finally {
        return JSON.stringify(result);
    }
}

//画像生成モデルのサービスを呼び出す
async function apiCall_generateImage(prompt) {
    const size = '1024x1024';
    const n = 1; //生成する画像の枚数　
    const imageFormat = 'png'; //画像のフォーマット
    const outputCompression = 100; //出力画像の圧縮率
    const apiVersion = '2025-04-01-preview';
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion }); 
    const results = await client.images.generate({
        prompt: prompt,
        size: size,
        output_compression: outputCompression,
        output_format: imageFormat,
        n: n
    });
    return results.data[0].b64_json;
}

//動作確認用のコード (確認後に削除)
generateImage("優秀な AI アシスタントの画像を日本の有名なアニメスタジオ風に描いてください")
    .then(result => console.log(result))

// エクスポートするためのモジュール    
module.exports = { ganarateImage };