const { matchPlayers } = require("./game_manager");
const { handleAnswerSubmission } = require("./question_handler");

function handleMessage(ws, message) {
  if (!ws.user) {
    console.log("⚠️ Unauthorized message attempt. Closing connection.");
    ws.close();
    return;
  }

  const data = JSON.parse(message);

  if (data.action === "joinGame") {
    console.log(`📥 Player ${ws.user.id} wants to join a game`);
    matchPlayers(ws.user.id, ws);
  }

  if (data.action === "answer:submit") {
    handleAnswerSubmission(data, ws.user.id);
  }
}

module.exports = { handleMessage };
