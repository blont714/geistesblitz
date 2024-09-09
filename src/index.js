// src/index.js
import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const app = express();
const s3 = new S3Client({ region: 'ap-northeast-1' });
const port = 3000;
const bucketName = 'geistesblitz';

// Get a random question image
app.get('/api/get-question', async (req, res) => {
    const questionKey = `question/question${Math.floor(Math.random() * 60) + 1}.JPG`;

    try {
        const command = new GetObjectCommand({ Bucket: bucketName, Key: questionKey });
        const data = await s3.send(command);
        const url = `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${questionKey}`;
        res.json({ imageUrl: url });
    } catch (error) {
        console.error('Error fetching question image:', error);
        res.status(500).json({ message: 'Error fetching question image.' });
    }
});

// Get object images
app.get('/api/get-objects', async (req, res) => {
    const objectKeys = Array.from({ length: 5 }, (_, i) => `object/object${i + 1}.JPG`);

    try {
        const objectUrls = await Promise.all(objectKeys.map(async (key) => {
            const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
            const data = await s3.send(command);
            return {
                key,
                url: `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${key}`
            };
        }));
        res.json({ objectUrls });
    } catch (error) {
        console.error('Error fetching object images:', error);
        res.status(500).json({ message: 'Error fetching object images.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
