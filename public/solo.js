document.addEventListener('DOMContentLoaded', function() {
    const questionImage = document.getElementById('question-image');
    const objectImages = document.querySelectorAll('.object-image');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let correctObject = ''; // 正解のオブジェクトのキーを保持する変数
    let answerData = null; // answer.json のデータを保持する変数

    // answer.jsonをロードする関数
    function loadAnswerData() {
        return fetch('answer.json') // answer.json のパスを適切に設定
            .then(response => response.json())
            .then(data => {
                answerData = data; // データを保持
            })
            .catch(error => console.error('Error loading answer data:', error));
    }

    // 問題画像をロードする関数
    function loadRandomQuestions() {
        fetch('/api/get-random-questions')
            .then(response => response.json())
            .then(data => {
                // データが配列であることを前提に、最初の問題画像を設定
                if (Array.isArray(data) && data.length > 0) {
                    questionImage.src = data[0].url; // ランダムな問題画像を設定
                    setCorrectObjectKey(); // 正解のオブジェクトキーを設定
                    console.log(correctObject)
                } else {
                    console.error('Unexpected data format or empty question list:', data);
                }
            })
            .catch(error => console.error('Error loading question image:', error));
    }

    // 正解のオブジェクトキーを設定する関数
    function setCorrectObjectKey() {
        if (!answerData) return;

        // 現在の問題画像に対応する解答を探す
        const answer = answerData.questionImages.find(item => item.questionImage === questionImage.src);

        if (answer) {
            correctObject = answer.correctObject; // 正解のオブジェクトキーを設定
        } else {
            console.error('Correct answer not found for the current question image.');
        }
    }

    // オブジェクト画像をロードする関数
    function loadObjectImages() {
        fetch('/api/get-objects')
            .then(response => response.json())
            .then(data => {
                // 受け取るデータが直接配列であることを前提に
                if (Array.isArray(data)) {
                    data.forEach((obj, index) => {
                        if (objectImages[index]) {
                            objectImages[index].src = obj.url; // url を設定
                        }
                    });
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error loading object images:', error));
    }

    // オブジェクトをクリックしたときの正誤判定
    function handleObjectClick(event) {
        const clickedObject = event.target.dataset.key; // クリックされたオブジェクトのキーを取得
        console.log(clickedObject)
        console.log(correctObject)
        if (clickedObject === correctObject) {
            updateScore(score + 1); // 正解ならスコアを増やす
            alert('正解！');
        } else {
            updateScore(score - 1); // 不正解ならスコアを減らす
            alert('不正解！');
        }

        // 新しい問題とオブジェクトをロード
        loadRandomQuestions();
        loadObjectImages();
    }

    // スコアを更新する関数
    function updateScore(newScore) {
        score = newScore;
        scoreDisplay.textContent = score;
    }

    // 初期ロード
    loadAnswerData().then(() => {
        loadRandomQuestions();
        loadObjectImages();
    });

    // オブジェクト画像にクリックイベントを設定
    objectImages.forEach(img => {
        img.addEventListener('click', handleObjectClick);
    });
});
