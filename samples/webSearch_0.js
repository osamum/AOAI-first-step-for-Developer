const dotenv = require("dotenv");
dotenv.config();

// Bing Search のエンドポイントと API キーを取得
const bing_search_endpoint = process.env['BING_SEARCH_ENDPOINT'];
const bing_search_key = process.env['BING_SEARCH_KEY'];

//指定された URL から HTML の body タグ内のコンテンツを取得
async function getBodyContent(url) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 Edge/85.0.564.51'
        }
    });
    
    const text = await response.text();
    const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : null;
}

//指定された HTML タグの範囲を削除
function rmTagRange(content, htmlTag) {
    const regex = new RegExp(`<${htmlTag}[^>]*>.*?</${htmlTag}>`, 'gs');
    return content.replace(regex, '');
}

//コントアウトの範囲を削除
function rmComment(content) {
    const regex = /<!--.*?-->/gs;
    return content.replace(regex, '');
}

//ドキュメントの構造に影響のない HTML タグ属性の削除
function sharpenTags(content) {
    const attributesToRemove = ['id', 'style', 'class', 'tabindex', 'width', 'height', 'target'];
    const regex = new RegExp(`\\s*(${attributesToRemove.join('|')})\\s*=\\s*("[^"]*"|'[^']*'|\\S+)?`, 'gi');
    return content.replace(/<[^>]+>/g, (tag) => tag.replace(regex, '').replace(/\s{2,}/g, ' ').trim());
}


//Bing Search API を使用して検索結果を取得
async function getBingSearchResult(query) {
    const endpoint = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=3`;

    try {
        const response = await fetch(endpoint, {
            headers: {
                'Ocp-Apim-Subscription-Key': bing_search_key
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.webPages;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

//言語モデルが回答を生成するためのプロンプト
async function createRequestWithWebSearchResult(query) {
    const webSerchResult = JSON.stringify(await getWebSearchResult(query));
        return `[question] の内容に対し[content]内のJSONの内容を使用して回答してください\n` +
            `・ 各要素の snippet、content の内容を付き合わせ、信頼性の高い情報を採用してください\n` +
            `・ 各要素の url のドメイン名からも信頼性を判断してください\n` +
            `・ 各要素の content 内の HTML タグの構造も参考にしてください\n` +
            `・ 自身の回答に不必要に重複する文章がないようにしてください\n` +
            `・ [question]に対し[content]の内容に回答としてふさわしい情報かないと判断した場合にはその旨を回答してください\n` +
            `[question]\n${query}\n\n[content]\n${webSerchResult}`
    }
    
    //言語モデルが回答を生成するための情報を生成
    async function getWebSearchResult(query) {
    // Bing Search の検索結果を取得
        const sitesList = (await getBingSearchResult(query)).value;
        const resultList = [];
        for (const site of sitesList) {
            const result = {};
            result.url = site.url;
            result.snippet = site.snippet;
            //Web ページの内容を取得
            const bodyContent = await getBodyContent(site.url);
            //コメントの削除
            let rmed_content = rmComment(bodyContent);　
            //不要なタグの削除
            rmed_content = rmTagRange(rmed_content, 'style');
            rmed_content = rmTagRange(rmed_content, 'script');
            rmed_content = rmTagRange(rmed_content, 'iframe');
            rmed_content = rmTagRange(rmed_content, 'area');
            rmed_content = rmTagRange(rmed_content, 'map');
            //空の div タグの削除
            rmed_content = rmed_content.replace(/<div><\/div>/g, '');
            //改行、タブの削除
            rmed_content = rmed_content.replace(/[\r\n\t]/g, '');
            //不要な属性の削除
            result.content = sharpenTags(rmed_content);
            resultList.push(result);
        }
        return resultList;
    }

    /* 検証用コード
    createRequestWithWebSearchResult('Azure OpenAI サービスについて教えてください').then(request => {
        console.log(request);
    });
    */

    module.exports = {
        createRequestWithWebSearchResult
    };