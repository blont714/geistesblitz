document.addEventListener('DOMContentLoaded', function() {
    const playerName = localStorage.getItem('playerName'); // 保存された名前を取得
    const nameDisplay = document.getElementById('name-display');
    
    if (playerName && nameDisplay) {
        nameDisplay.textContent = playerName; // プレイヤー名を表示
    }
});