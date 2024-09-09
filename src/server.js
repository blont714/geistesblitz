const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');

const app = express();
const s3 = new AWS.S3({ region: 'ap-northeast-1' });
const port = 3000;
const bucketName = 'geistesblitz';

// 静的ファイルを提供するためのミドルウェア
app.use(express.static(path.join(__dirname, '../public')));

// app.get('/api/get-random-questions', async (req, res) => {
//     try {
//         // Get a list of all question images
//         const data = await s3.listObjectsV2({
//             Bucket: bucketName,
//             Prefix: 'question/'
//         }).promise();

//         const questionImages = data.Contents
//             .map((item) => `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${item.Key}`)
//             .filter((url) => url.endsWith('.JPG'));

//         // Shuffle the images
//         for (let i = questionImages.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [questionImages[i], questionImages[j]] = [questionImages[j], questionImages[i]];
//         }
//         console.log(questionImages);
//         res.json({ questionImages });
//     } catch (error) {
//         console.error('Error fetching questions:', error);
//         res.status(500).json({ message: 'Error fetching questions.' });
//     }
// });

app.get('/api/get-random-questions', async (req, res) => {
    try {
        // Get a list of all question images
        const data = await s3.listObjectsV2({
            Bucket: bucketName,
            Prefix: 'question/'
        }).promise();

        const questionImages = data.Contents
            .filter((item) => item.Key.endsWith('.JPG'))
            .map((item) => ({
                key: item.Key,
                url: `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${item.Key}`
            }));

        // Shuffle the images
        for (let i = questionImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questionImages[i], questionImages[j]] = [questionImages[j], questionImages[i]];
        }

        // console.log(questionImages);
        res.json(questionImages);  // Return the array directly
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions.' });
    }
});

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
