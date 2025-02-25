const apiBaseUrl = process.env.REST_SERVER_HOST; 

async function startGame(player1, player2) {
  const response = await fetch(`${apiBaseUrl}/game/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player1, player2 }),
  });

  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.message || "Failed to start game");
}

async function getQuestionById(questionId) {
  const response = await fetch(`${apiBaseUrl}/question/${questionId._id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.message || "Failed to fetch question");
}

async function endGameAndUpdateDatabase(gameId) {
  const response = await fetch(`${apiBaseUrl}/game/end/${gameId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to end game");
  }
}

module.exports = { startGame, getQuestionById, endGameAndUpdateDatabase };
