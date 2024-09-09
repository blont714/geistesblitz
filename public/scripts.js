document.getElementById('start-button').addEventListener('click', function() {
    const playerName = document.getElementById('player-name').value;
    if (playerName) {
        // ゲームモード選択画面に遷移
        window.location.href = '/game.html';
    } else {
        alert('名前を入力してください。');
    }
});
