//[PLACEHOLDER:require rag.js]
const lm = require('./AOAI/lm.js');

// 標準入力を取得するための設定
process.stdin.setEncoding('utf-8');

function showPrompt() {
    console.log('\nPrompt:');
}
showPrompt();

// 標準入力を受け取る
process.stdin.on('data', async function(data) {

    //[REPLACE: RAG Integration]
    console.log(`\nAI : ${await lm.sendMessage(data.trim())}`);

    showPrompt();
});
