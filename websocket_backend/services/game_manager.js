const WebSocket = require("ws");
const axios = require("axios");

const playersQueue = new Map();
const games = {};

async function matchPlayers(playerId, ws) {
  playersQueue.set(playerId, ws);

  if (playersQueue.size >= 2) {
    console.log("🔍 Attempting to match players...");

    let [player1Id, player1Ws] = playersQueue.entries().next().value;
    playersQueue.delete(player1Id);

    let [player2Id, player2Ws] = playersQueue.entries().next().value;
    playersQueue.delete(player2Id);

    if (!player1Ws || player1Ws.readyState !== WebSocket.OPEN) {
      playersQueue.set(player2Id, player2Ws);
      return;
    }
    if (!player2Ws || player2Ws.readyState !== WebSocket.OPEN) {
      playersQueue.set(player1Id, player1Ws);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REST_SERVER_HOST}:${process.env.API_PORT}/game/start`, {
        player1: player1Id,
        player2: player2Id,
      });

      const { gameId, questions } = response.data;

      games[gameId] = {
        player1: { id: player1Id, ws: player1Ws },
        player2: { id: player2Id, ws: player2Ws },
        questions,
        currentQuestionIndex: 0,
        scores: { [player1Id]: 0, [player2Id]: 0 },
        pendingAnswers: {},
      };

      const gameInitPayload = {
        action: "game:init",
        gameId,
        player1: player1Id,
        player2: player2Id,
      };

      player1Ws.send(JSON.stringify(gameInitPayload));
      player2Ws.send(JSON.stringify(gameInitPayload));

      console.log(`🎮 Game ${gameId} started between ${player1Id} & ${player2Id}`);
      sendNextQuestion(gameId);
    } catch (error) {
      console.error("❌ Error starting game via API:", error.response?.data || error.message);
      playersQueue.set(player1Id, player1Ws);
      playersQueue.set(player2Id, player2Ws);
    }
  }
}

function sendNextQuestion(gameId) {
    const game = games[gameId];
    if (!game || game.currentQuestionIndex >= game.questions.length) return;
  
    const nextQuestion = game.questions[game.currentQuestionIndex];
  
    try {
      const payload = {
        action: "question:send",
        gameId,
        question: nextQuestion,
      };
  
      game.player1.ws.send(JSON.stringify(payload));
      game.player2.ws.send(JSON.stringify(payload));
  
      console.log(`📨 Sent question ${game.currentQuestionIndex + 1} to both players`);
    } catch (error) {
      console.error("❌ Error sending question:", error);
    }
  }
  
  function determineWinner(game) {
    const player1Score = game.scores[game.player1.id] || 0;
    const player2Score = game.scores[game.player2.id] || 0;
  
    if (player1Score > player2Score) {
      return game.player1.id;
    } else if (player2Score > player1Score) {
      return game.player2.id;
    } else {
      return "Draw";
    }
  }

  function sendGameEndPayload(game) {
    const player1Score = game.scores[game.player1.id] || 0;
    const player2Score = game.scores[game.player2.id] || 0;

    let winner;
    if (player1Score > player2Score) {
        winner = game.player1.id;
    } else if (player2Score > player1Score) {
        winner = game.player2.id;
    } else {
        winner = "DRAW"; // Handle draw case
    }

    const gameEndPayload = {
        action: "game:end",
        gameId: game.gameId, // Ensure gameId is present
        player1Score,
        player2Score,
        winner, // Now can be "DRAW" too
    };

    // Send the result to both players
    if (game.player1.ws) game.player1.ws.send(JSON.stringify(gameEndPayload));
    if (game.player2.ws) game.player2.ws.send(JSON.stringify(gameEndPayload));

    console.log("Game Results Sent")
}



module.exports = { matchPlayers, sendNextQuestion, determineWinner, sendGameEndPayload, games };
