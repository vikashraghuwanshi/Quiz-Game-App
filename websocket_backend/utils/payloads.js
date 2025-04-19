function gameInitializationPayload(gameId, player1Id, player2Id) {
    return {
        action: "game:init",
        gameId,
        player1: player1Id,
        player2: player2Id,
    };
}

// payload for questions
function questionsSendPayload(gameId, question) {
    const { answer, ...questionWithoutAnswer } = question;
    return {
        action: "question:send",
        gameId,
        question: questionWithoutAnswer,
    };
}

function gameEndedPayload(game, winner, player1Score, player2Score, player1Ws, player2Ws) {
    return {
        action: "game:end",
        gameId: game.gameId, // Ensure gameId is present
        player1: player1Ws.user.username,
        player1Score,
        player2: player2Ws.user.username,
        player2Score,
        winner, // Now can be "DRAW" too
    };
}

function optionSelectPayload(selectedIndex) {
    return {
        action: "option:select",
        selectedIndex,
    };
}

module.exports = { gameInitializationPayload, questionsSendPayload, gameEndedPayload, optionSelectPayload };
