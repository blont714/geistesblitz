// src/index.js
import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const app = express();
const s3 = new S3Client({ region: 'ap-northeast-1' });
const port = 3000;
const bucketName = 'geistesblitz';

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

// Get question and answers
app.get('/api/get-question-and-answers', async (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Failed to parse data file' });
        }

        const questionSets = jsonData.questionSets;
        const randomIndex = Math.floor(Math.random() * questionSets.length);
        const questionSet = questionSets[randomIndex];

        res.json({
            questionImage: questionSet.questionImage,
            correctAnswerIndex: questionSet.correctAnswer,
            objectImages: jsonData.objectImages
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
