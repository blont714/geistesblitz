document.getElementById('start-game-btn').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value;
    if (playerName.trim() === '') {
        alert('名前を入力してください');
        return;
    }
    window.location.href = '/chooseMode.html';
});
