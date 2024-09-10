document.addEventListener('DOMContentLoaded', function() {
    const questionImage = document.getElementById('question-image');
    const objectImages = document.querySelectorAll('.object-image');
    const scoreDisplay = document.getElementById('score');
    const questionNumberDisplay = document.getElementById('current-question');
    const playerName = localStorage.getItem('playerName');
    const nameDisplay = document.getElementById('name-display');
    let score = 0;
    let currentQuestionNumber = 0; // 現在の問題番号を管理する変数
    let correctObject = ''; // 正解のオブジェクトのキーを保持する変数
    let answerData = null; // answer.json のデータを保持する変数
    let questionList = []; // 問題リストを保持する変数
    const totalQuestions = 5; // 全部で60問

    if (playerName && nameDisplay) {
        nameDisplay.textContent = playerName; // プレイヤー名を表示
    }

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

        // 問題リストが空であれば取得
        if (questionList.length === 0) {
            fetch('/api/get-random-questions')
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        questionList = data; // 質問リストを保存
                        showNextQuestion(); // 次の問題を表示
                    } else {
                        console.error('Unexpected data format or empty question list:', data);
                    }
                })
                .catch(error => console.error('Error loading question image:', error));
        } else {
            showNextQuestion(); // 次の問題を表示
        }
    }

    // 次の問題を表示する関数
    function showNextQuestion() {
        if (currentQuestionNumber >= totalQuestions) {
            // 60問すべて終了したら結果画面に遷移
            window.location.href = '/result.html';
            return;
        }

        const question = questionList[currentQuestionNumber];
        questionImage.src = question.url; // ランダムな問題画像を設定
        setCorrectObjectKey(); // 正解のオブジェクトキーを設定
        currentQuestionNumber++; // 問題番号をインクリメント
        questionNumberDisplay.textContent = currentQuestionNumber; // 表示を更新
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
        if (clickedObject === correctObject) {
            updateScore(score + 1); // 正解ならスコアを増やす
            alert('正解！');
        } else {
            updateScore(score - 1); // 不正解ならスコアを減らす
            alert('不正解！');
        }

        // 新しい問題とオブジェクトをロード
        showNextQuestion();
        // loadObjectImages();
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
