document.addEventListener('DOMContentLoaded', function() {
    const questionImage = document.getElementById('question-image');
    const objectImages = document.querySelectorAll('.object-image');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let correctObject = ''; // 正解のオブジェクトのキーを保持する変数

    // 問題画像をロードする関数
    function loadRandomQuestions() {
        fetch('/api/get-random-questions')
            .then(response => response.json())
            .then(data => {
                // データが配列であることを前提に、最初の問題画像を設定
                if (Array.isArray(data) && data.length > 0) {
                    const randomQuestion = data[0]; // 一つ目の問題を選択
                    questionImage.src = randomQuestion.url; // 問題画像のURLを設定
                    // correctObjectKey = randomQuestion.key; // 正解のキーを設定
                } else {
                    console.error('Unexpected data format or empty question list:', data);
                }
            })
            .catch(error => console.error('Error loading question image:', error));
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
        const clickedObjectKey = event.target.dataset.key; // クリックされたオブジェクトのキーを取得

        if (clickedObjectKey === correctObjectKey) {
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
    loadRandomQuestions();
    loadObjectImages();

    // オブジェクト画像にクリックイベントを設定
    objectImages.forEach(img => {
        img.addEventListener('click', handleObjectClick);
    });
});
