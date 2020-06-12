// index.js
const functions = require('firebase-functions');
// Expressの読み込み
const express = require("express");
const requestPromise = require('request-promise-native');  // 動画３追加
const cors = require('cors'); // 動画４追加
const app = express();

// app.use(cors());  // 動画４追加（全部追加する場合ここ）

// APIにリクエストを送る関数を定義
const getDataFromApi = async keyword => {
    // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
    const requestUrl = 'https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle:';
    const result = await requestPromise(`${requestUrl}${keyword}`);
    return result;
}

app.get('/hello', (req, res) => {
    // レスポンスの設定
    res.send('Hello Express!');
});

// ↓↓↓ エンドポイントを追加 コロンのあとにするとパラメーターが文字列として取れる↓↓↓
app.get('/user/:userId', (req, res) => {
    const users = [
        { id: 1, name: 'ジョナサン' },
        { id: 2, name: 'ジョセフ' },
        { id: 3, name: '重太郎' },
        { id: 4, name: '仗助' },
        { id: 5, name: 'ジョルノ' },
    ];
    // req.params.userIdでURLの後ろにつけた値をとれる．Number関数で文字から数字に変換する
    const targetUser = users.find(user => user.id === Number(req.params.userId));
    res.send(targetUser);
});

// エンドポイント追加動画３
// ここに`cors()`を追加動画4
app.get('/gbooks/:keyword', cors(), async (req, res) => {
    // APIリクエストの関数を実行
    const response = await getDataFromApi(req.params.keyword);
    res.send(response);
});

// 出力
const api = functions.https.onRequest(app);
module.exports = { api };

//ローカル$ firebase serve//firebase emulators:start
// http://localhost:5000/functions-47432/us-central1/
// デプロイ先$ firebase deploy
//https://us-central1-functions-47432.cloudfunctions.net/

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });
