const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { PORT } = require('./config');
const AWS = require('aws-sdk');

const app = express();

// S3の設定
const s3 = new AWS.S3({ region: 'ap-northeast-1' });

// ミドルウェア設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public')));

// APIルート設定
app.use('/api', require('./routes'));

// S3からオブジェクト画像を取得するエンドポイントを追加
app.get('/api/get-objects', async (req, res) => {
    const bucketName = 'geistesblitz';
    const objectKeys = Array.from({ length: 5 }, (_, i) => `object/object${i + 1}.JPG`);
    
    try {
        const objectImages = await Promise.all(
            objectKeys.map(async (key) => {
                const object = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
                return {
                    key,
                    url: `https://${bucketName}.s3.ap-northeast-1.amazonaws.com/${key}`
                };
            })
        );
        res.status(200).json(objectImages);
    } catch (error) {
        console.error('Error fetching object images:', error);
        res.status(500).json({ message: 'Failed to fetch object images' });
    }
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
