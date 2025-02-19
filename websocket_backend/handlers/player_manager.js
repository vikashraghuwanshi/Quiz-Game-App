const { sendGameEndPayload } = require("./game_manager");
const { games, activePlayers } = require("../in-memory-store/store");


async function removeDisconnectedPlayer(ws) {
    const game = games[ws.gameId]; // Ensure gameId is attached to ws and game exists

    if (!game) {
        console.log(`No active game found for player ${ws.user.id}.`);
        return;
    }

    const playerId = ws.user.id;
    const gameId = game.gameId;

    console.log(`Player ${playerId} disconnected. Waiting 30 seconds for reconnection...`);

    // ✅ Remove the WebSocket from the player's dictionary (O(1) operation)
    if (game.player1.id === playerId) {
      delete game.player1.ws[ws.connectionId];
    } else if (game.player2.id === playerId) {
        delete game.player2.ws[ws.connectionId];
    }
  
    game.isActive = false;
    // timeout for 30 seconds before ending the game
    game.disconnectTimeout = setTimeout(async () => {
        const gameAfterTimeout = games[gameId]; // Re-check if the game still exists

        // Only end the game if the game still exists after the timeout
        if (gameAfterTimeout && !game.isActive) {
            console.log(`Player ${playerId} did not reconnect in time. Ending game ${ws.gameId}...`);
            activePlayers.delete(playerId);
            await sendGameEndPayload(gameAfterTimeout); // Pass the game to sendGameEndPayload
        } else {
            console.log(`Game ${gameId} already ended or removed.`);
        }
    }, 30000); // 30 seconds delay
}


module.exports = { removeDisconnectedPlayer };
