document.addEventListener('DOMContentLoaded', function() {
    // ソロモードから保存された得点と名前を取得
    const playerName = localStorage.getItem('playerName');
    const score = localStorage.getItem('score');

    // 名前と得点を表示するためのテキストを作成
    const resultText = document.getElementById('result-text');
    if (playerName && score) {
        resultText.textContent = `${playerName} ${score}点`;
    } else {
        resultText.textContent = '結果が取得できませんでした。';
    }

    // 「モード選択へ戻る」ボタンのクリックイベント設定
    document.getElementById('return-button').addEventListener('click', function() {
        window.location.href = '/chooseMode.html'; // モード選択画面に遷移
    });
});
