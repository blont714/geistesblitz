const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');

const app = express();
const s3 = new AWS.S3({ region: 'ap-northeast-1' });
const port = 3000;
const bucketName = 'geistesblitz';

// 静的ファイルを提供するためのミドルウェア
app.use(express.static(path.join(__dirname, '../public')));

// Get question image and object images
app.get('/api/get-question-and-answer', async (req, res) => {
    const questionKey = `question/question${Math.floor(Math.random() * 60) + 1}.JPG`;  // 60問ランダムで取得

    try {
        const data = await s3.listObjects({
            Bucket: bucketName,
            Prefix: 'object/'
        }).promise();

        const objectImages = data.Contents.map((item) => ({
            key: item.Key,
            url: `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${item.Key}`
        }));

        res.json({ 
            questionImage: `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${questionKey}`, 
            objectImages 
        });
    } catch (error) {
        console.error('Error fetching question and answer:', error);
        res.status(500).json({ message: 'Error fetching question and answer.' });
    }
});

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
