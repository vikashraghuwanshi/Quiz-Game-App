const { startGame: startGameGraphQL, getQuestionById: getQuestionByIdGraphQL, endGameAndUpdateDatabase: endGameGraphQL } = require("./game_service_graphql");
const { startGame: startGameREST, getQuestionById: getQuestionByIdREST, endGameAndUpdateDatabase: endGameREST } = require("./game_service_rest");

const backendType = process.env.ACTIVE_BACKEND_SERVER || "rest";

const gameService = {
  startGame: backendType === "graphql" ? startGameGraphQL : startGameREST,
  getQuestionById: backendType === "graphql" ? getQuestionByIdGraphQL : getQuestionByIdREST,
  endGameAndUpdateDatabase: backendType === "graphql" ? endGameGraphQL : endGameREST,
};

module.exports = gameService;
