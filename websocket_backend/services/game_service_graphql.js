const graphqlEndpoint = `${process.env.GRAPHQL_SERVER_HOST}`;

async function startGame(player1, player2) {
  const mutation = `
    mutation StartGame($player1: String!, $player2: String!) {
      startGame(player1: $player1, player2: $player2) {
        _id
        questions { id }
      }
    }
  `;

  const variables = { player1, player2 };
  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation, variables }),
  });

  const data = await response.json();
  if (response.ok && !data.errors) return data.data.startGame;
  throw new Error(data.errors?.[0]?.message || "GraphQL request failed");
}

async function getQuestionById(questionId) {
  const query = `
    query GetQuestion($id: ID!) {
      getQuestionById(id: $id) {
        id
        text
        options
        correctAnswer
      }
    }
  `;

  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { id: questionId.id } }),
  });

  const data = await response.json();
  if (response.ok && !data.errors) return data.data.getQuestionById;
  throw new Error(data.errors?.[0]?.message || "GraphQL request failed");
}

async function endGameAndUpdateDatabase(gameId) {
  const mutation = `
    mutation EndGame($gameId: ID!) {
      endGame(gameId: $gameId) { _id isCompleted }
    }
  `;

  await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation, variables: { gameId } }),
  });
}

module.exports = { startGame, getQuestionById, endGameAndUpdateDatabase };
