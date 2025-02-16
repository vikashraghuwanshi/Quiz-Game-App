const { games } = require("./game_manager");

function removeDisconnectedPlayer(ws) {
  for (const [gameId, game] of Object.entries(games)) {
    if (game.player1.ws === ws || game.player2.ws === ws) {
      const remainingPlayer = game.player1.ws === ws ? game.player2 : game.player1;

      console.log(`🏆 Player ${remainingPlayer.id} wins by default!`);

      const gameEndPayload = {
        action: "game:end",
        gameId,
        player1Score: game.scores[game.player1.id] || 0,
        player2Score: game.scores[game.player2.id] || 0,
        winner: remainingPlayer.id,
      };

      remainingPlayer.ws.send(JSON.stringify(gameEndPayload));
      delete games[gameId];

      return;
    }
  }
}

module.exports = { removeDisconnectedPlayer };
