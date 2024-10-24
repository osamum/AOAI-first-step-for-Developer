const rag = require('./AOAI/rag.js')
const lm = require('./AOAI/lm.js');

// 標準入力を取得するための設定
process.stdin.setEncoding('utf-8');

function showPrompt() {
    console.log('\nPrompt:');
}
showPrompt();

// 標準入力を受け取る
process.stdin.on('data', async function (data) {
    const inputString = data.trim();
    console.log(`\nAI : ${await lm.sendMessage(await rag.findIndex(inputString),getImageUrls(inputString))}`);
    showPrompt();
});

//文字列中の画像の URL を配列として取得する関数
function getImageUrls(content) {
    const regex = /(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif))/g;
    return content.match(regex) || [];
}