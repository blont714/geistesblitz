document.addEventListener('DOMContentLoaded', function() {
    const questionImage = document.getElementById('question-image');
    const objectImages = document.querySelectorAll('.object-image');
    const scoreDisplay = document.getElementById('score');
    let score = 0;

    function loadQuestion() {
        fetch('/api/get-question')
            .then(response => response.json())
            .then(data => {
                questionImage.src = data.imageUrl;
            })
            .catch(error => console.error('Error loading question image:', error));
    }

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

    function updateScore(newScore) {
        score = newScore;
        scoreDisplay.textContent = score;
    }

    // Initial load
    loadQuestion();
    loadObjectImages();
});
