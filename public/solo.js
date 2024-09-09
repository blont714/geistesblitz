document.addEventListener('DOMContentLoaded', function() {
    const questionImage = document.getElementById('question-image');
    const objectImages = document.querySelectorAll('.object-image');
    const scoreDisplay = document.getElementById('score');
    let score = 0;

    function loadRandomQuestion() {
        // ここでLambdaからランダムな問題画像のURLを取得し、questionImageに設定
        fetch('/api/get-random-question')
            .then(response => response.json())
            .then(data => {
                questionImage.src = data.imageUrl;
            })
            .catch(error => console.error('Error loading question image:', error));
    }

    function loadObjectImages() {
        // ここでLambdaからオブジェクト画像のURLを取得し、objectImagesに設定
        fetch('/api/get-objects')
            .then(response => response.json())
            .then(data => {
                data.objectUrls.forEach((url, index) => {
                    if (objectImages[index]) {
                        objectImages[index].src = url;
                    }
                });
            })
            .catch(error => console.error('Error loading object images:', error));
    }

    function updateScore(newScore) {
        score = newScore;
        scoreDisplay.textContent = score;
    }

    // 初期ロード
    loadRandomQuestion();
    loadObjectImages();
});
