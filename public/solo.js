document.addEventListener('DOMContentLoaded', function() {
    const questionImage = document.getElementById('question-image');
    const objectImages = document.querySelectorAll('.object-image');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let correctObjectKey = ''; // 正解のオブジェクトのキーを保持する変数

    // 問題画像をロードする関数
    function loadQuestionAndAnswer() {
        fetch('/api/get-question-and-answer')
            .then(response => response.json())
            .then(data => {
                questionImage.src = data.imageUrl;
                correctObjectKey = data.correctObjectKey; // 正解のオブジェクトキーを取得
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
        loadQuestionAndAnswer();
        loadObjectImages();
    }

    // スコアを更新する関数
    function updateScore(newScore) {
        score = newScore;
        scoreDisplay.textContent = score;
    }

    // 初期ロード
    loadQuestionAndAnswer();
    loadObjectImages();

    // オブジェクト画像にクリックイベントを設定
    objectImages.forEach(img => {
        img.addEventListener('click', handleObjectClick);
    });
});
