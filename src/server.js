const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { PORT } = require('./config');
const path = require('path');

const app = express();

// ミドルウェア設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public')));

// ルート設定
app.use('/api', routes);

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
