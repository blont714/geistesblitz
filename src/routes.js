const express = require('express');
const router = express.Router();
const gameLogic = require('./gameLogic');

// ゲームロジックAPIエンドポイント
router.post('/start', gameLogic.startGame);
router.post('/answer', gameLogic.checkAnswer);

module.exports = router;
