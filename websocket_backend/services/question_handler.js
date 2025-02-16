const { sendNextQuestion, determineWinner, sendGameEndPayload, games } = require("./game_manager");

function handleAnswerSubmission(data, playerId) {
  try {
    const game = games[data.gameId];
    if (!game || game.currentQuestionIndex >= game.questions.length) return;

    console.log(`✅ Answer received from ${playerId}`);

    game.pendingAnswers[playerId] = data.answerIndex;

    if (game.pendingAnswers[game.player1.id] !== undefined && game.pendingAnswers[game.player2.id] !== undefined) {
      console.log("✅ Both players answered");

      const currentQuestion = game.questions[game.currentQuestionIndex];

      if (game.pendingAnswers[game.player1.id] === currentQuestion.correctAnswer) {
        game.scores[game.player1.id] += 10;
      }
      if (game.pendingAnswers[game.player2.id] === currentQuestion.correctAnswer) {
        game.scores[game.player2.id] += 10;
      }

      game.currentQuestionIndex += 1;
      game.pendingAnswers = {};

      if (game.currentQuestionIndex >= game.questions.length) {
        const winner = determineWinner(game);
        sendGameEndPayload(game, winner);
      } else {
        sendNextQuestion(data.gameId);
      }
    }
  } catch (error) {
    console.error("❌ Error processing answer:", error);
  }
}

module.exports = { handleAnswerSubmission };
