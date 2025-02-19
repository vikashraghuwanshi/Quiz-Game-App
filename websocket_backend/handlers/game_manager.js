const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { playersQueue, games, activePlayers } = require("../in-memory-store/store");
const { gameInitializationPayload, questionsSendPayload, gameEndedPayload } = require("../utils/payloads");
const gameService = require("../services/game_service");


function restorePlayerState(playerId, ws) {
    const gameId = activePlayers.get(playerId);

    if (!gameId || !games[gameId]) {
      ws.send(JSON.stringify({ action: "game:ended", message: "Game session not found or already completed." }));
      return;
    }

    const game = games[gameId];
    game.isActive = true;
    console.log(`🔄 Player ${playerId} reconnected to Game ${gameId}`);

    if (game.disconnectTimeout) {
      clearTimeout(game.disconnectTimeout);
      delete game.disconnectTimeout;
      console.log(`Reconnection detected: Cancelled game ending for ${gameId}.`);
    }

    try {
      const gameInitPayload = gameInitializationPayload(gameId, game.player1.id, game.player2.id);
      const questionPayload = questionsSendPayload(gameId, game.currentQuestion);

      const connectionId = uuidv4(); // Generate a unique ID for this WebSocket connection
      ws.connectionId = connectionId;
      ws.gameId = activePlayers.get(playerId);

      if (game.player1.id === playerId) {
          game.player1.ws[connectionId] = ws;
          ws.send(JSON.stringify(gameInitPayload));
          ws.send(JSON.stringify(questionPayload));
      } else if (game.player2.id === playerId) {
          game.player2.ws[connectionId] = ws;
          ws.send(JSON.stringify(gameInitPayload));
          ws.send(JSON.stringify(questionPayload));
      } else {
          ws.send(JSON.stringify({ action: "error", message: "Player not part of this game." }));
        return;
      }

      console.log(`📨 Sent question ${game.currentQuestionIndex + 1} to reconnected player`);
    } catch (error) {
      console.error("❌ Error sending question:", error.message);
    }
}


async function matchPlayers(playerId, ws) {
    if (activePlayers.has(playerId)) {
      restorePlayerState(playerId, ws);
      return;
    }

    playersQueue.set(playerId, ws);

    if (playersQueue.size >= 2) {
      const [player1Id, player1Ws] = playersQueue.entries().next().value;
      playersQueue.delete(player1Id);
      const [player2Id, player2Ws] = playersQueue.entries().next().value;
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
        const gameData = await gameService.startGame(player1Id, player2Id);
        if (!gameData) throw new Error("Failed to start game");

        const { _id, questions } = gameData;
        const gameId = _id;
        games[gameId] = {
          gameId,
          player1: { id: player1Id, ws: {} },
          player2: { id: player2Id, ws: {} },
          questions,
          currentQuestionIndex: 0,
          scores: { [player1Id]: 0, [player2Id]: 0 },
          pendingAnswers: {},
          isActive: true,
        };

        const connectionId1 = uuidv4();
        const connectionId2 = uuidv4();
        games[gameId].player1.ws[connectionId1] = player1Ws;
        games[gameId].player2.ws[connectionId2] = player2Ws;

        activePlayers.set(player1Id, gameId);
        activePlayers.set(player2Id, gameId);

        const gameInitPayload = gameInitializationPayload(gameId, player1Id, player2Id);
        player1Ws.send(JSON.stringify(gameInitPayload));
        player2Ws.send(JSON.stringify(gameInitPayload));

        sendNextQuestion(gameId);
      } catch (error) {
        console.error("❌ Error starting game:", error.message);
        playersQueue.set(player1Id, player1Ws);
        playersQueue.set(player2Id, player2Ws);
      }
    }
}

async function sendNextQuestion(gameId) {
    const game = games[gameId];
    if (!game || game.currentQuestionIndex >= game.questions.length) return;

    const nextQuestion = await gameService.getQuestionById(game.questions[game.currentQuestionIndex]);
    game.currentQuestion = nextQuestion;

    try {
      const questionPayload = questionsSendPayload(gameId, nextQuestion);

      Object.values(game.player1.ws).forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(questionPayload));
      });

      Object.values(game.player2.ws).forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(questionPayload));
      });
    } catch (error) {
      console.error("❌ Error sending question:", error.message);
    }
}

function determineWinner(game, player1Ws, player2Ws) {
    const player1Score = game.scores[game.player1.id] || 0;
    const player2Score = game.scores[game.player2.id] || 0;

    if (player1Score > player2Score 
          || (game.isActive == false &&
            activePlayers.get(game.player1.id) == game.gameId)) {
              const username = player1Ws?.user?.username; 
        return username;
    } else if (player2Score > player1Score
          || (game.isActive == false &&
            activePlayers.get(game.player2.id) == game.gameId)) {
              const username = player2Ws?.user?.username; 
              return username;
    } else {
        return "DRAW";
    }
}

async function sendGameEndPayload(game) {
    const player1Score = game.scores[game.player1.id] || 0;
    const player2Score = game.scores[game.player2.id] || 0;

    const player1Ws = Object.values(game.player1.ws)[0];
    const player2Ws = Object.values(game.player2.ws)[0];

    const winner = determineWinner(game, player1Ws, player2Ws);

    const gameEndPayload = gameEndedPayload(game, winner, player1Score, player2Score, player1Ws, player2Ws);

    Object.values(game.player1.ws).forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(gameEndPayload));
    });

    Object.values(game.player2.ws).forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(gameEndPayload));
    });

    console.log("Game Results Sent");
    await gameService.endGameAndUpdateDatabase(game.gameId);

    activePlayers.delete(game.player1.id);
    activePlayers.delete(game.player2.id);
    delete games[game.gameId];
    console.log(`Game ${game.gameId} removed from in-memory games map.`);
}

module.exports = { matchPlayers, sendNextQuestion, sendGameEndPayload };
