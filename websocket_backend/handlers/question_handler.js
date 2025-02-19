const { games, activePlayers } = require("../in-memory-store/store");
const { sendNextQuestion, sendGameEndPayload } = require("./game_manager");
const { optionSelectPayload } = require("../utils/payloads");


function sendOptionSelectPayload(gameId, playerId, selectedIndex) {
  const game = games[gameId];

  if (!game) {
      console.log(`❌ Game ${gameId} not found.`);
      return;
  }

  let playerWsDict;
  if (game.player1.id === playerId) {
      playerWsDict = game.player1.ws;
  } else if (game.player2.id === playerId) {
      playerWsDict = game.player2.ws;
  } else {
      console.log(`❌ Player ${playerId} is not part of game ${gameId}`);
      return;
  }

  const selectedOptionPayload = optionSelectPayload(selectedIndex);
  
  // ✅ Send to all active WebSocket connections of the player
  Object.values(playerWsDict).forEach(ws => {
      ws.send(JSON.stringify(selectedOptionPayload));
  });

  console.log(`📤 Sent option select payload to Player ${playerId} in Game ${gameId}`);
}


async function handleAnswerSubmission(data, playerId) {
  try {
    const game = games[data.gameId];
    if (!game || activePlayers.get(playerId) !== game.gameId 
            || game.currentQuestionIndex >= game.questions.length) return;
    
    sendOptionSelectPayload(data.gameId, playerId, data.answerIndex);
    console.log(`✅ Answer received from ${playerId}`);

    game.pendingAnswers[playerId] = data.answerIndex;

    if (game.pendingAnswers[game.player1.id] !== undefined && game.pendingAnswers[game.player2.id] !== undefined) {
      console.log("✅ Both players answered");

      const currentQuestion = game.currentQuestion;

      if (String(game.pendingAnswers[game.player1.id]) === String(currentQuestion.correctAnswer)) {
        game.scores[game.player1.id] += 10;
      }
      if (String(game.pendingAnswers[game.player2.id]) === String(currentQuestion.correctAnswer)  ) {
        game.scores[game.player2.id] += 10;
      }

      game.currentQuestionIndex += 1;
      game.pendingAnswers = {};
      


      if (game.currentQuestionIndex >= game.questions.length) {
        sendGameEndPayload(game);
      } else {
        sendNextQuestion(data.gameId);
      }
    }
  } catch (error) {
    console.error("❌ Error processing answer:", error);
  }
}

module.exports = { handleAnswerSubmission };
