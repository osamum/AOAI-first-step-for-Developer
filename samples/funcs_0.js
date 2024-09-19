function getCurrentDatetime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため +1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = daysOfWeek[now.getDay()]; // 数字から曜日を取得

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} (${dayOfWeek})`;
}

//console.log(getCurrentDatetime());

async function callApi(url) {
    try {
        const response = await fetch(url);

        // レスポンスのチェック
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // レスポンスを JSON として返す
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // エラーを投げて呼び出し元で処理できるようにする
    }
}

// getGitHubUserinfo 関数を定義
async function getGitHubUserinfo(userName) {
    const url = `https://api.github.com/users/${userName}`;
    const userInfo = await callApi(url);
    return userInfo;
}

// 使用例
getGitHubUserinfo('octocat')
    .then(userInfo => console.log(userInfo))
    .catch(error => console.error('Error fetching GitHub user info:', error));

//外部から関数 getCurrentDatetime,getGitHubUserinfo を利用できるようにする
//module.exports = {getCurrentDatetime,getGitHubUserinfo};