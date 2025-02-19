import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { initializeWebSocket, closeWebSocket, joinGame, submitAnswer, isWebSocketConnected } from "./services/websocket_service";

function Quiz() {
  const [playerName, setPlayerName] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [scores, setScores] = useState({});
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState(null);
  const [gameJoined, setGameJoined] = useState(false);
  const [token, setToken] = useState(null);

  // Decode token and extract player name
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setPlayerName(decoded.username);
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  // handle webSocket messages
  const handleMessage = (data) => {
    if (data.action === "game:init") {
      setGameId(data.gameId);
      setWaitingForOpponent(false);
    }

    if (data.action === "question:send") {
      setQuestion(data.question || null);
      setSelectedAnswer(null);
    }

    if (data.action === "game:end") {
      setScores({ player1: data.player1Score, player2: data.player2Score });
      setPlayers({ player1: data.player1, player2: data.player2 });
      setWinner(data.winner);
    }

    if (data.action === "option:select") {
      setSelectedAnswer(data.selectedIndex);
    }
  };

  // initialize webSocket connection
  useEffect(() => {
    if (token) {
      initializeWebSocket(token, handleMessage);
    }
    return () => closeWebSocket(); // Cleanup on unmount
  }, [token]);

  // function to join a game
  const handleJoinGame = () => {
    if (!isWebSocketConnected() || !token) return;
    joinGame();
    setGameJoined(true);
    setWinner(null);
    setWaitingForOpponent(true);
  };

  // function to submit an answer
  const handleSubmitAnswer = (answerIndex) => {
    if (!isWebSocketConnected() || selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    submitAnswer(gameId, answerIndex);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {playerName && <h2>Welcome, {playerName}!</h2>} {/* ✅ Show Player Name */}
  
      <h1>Real-Time Quiz Game</h1>
  
      {(!gameJoined || winner) && (
        <button onClick={handleJoinGame} style={{ padding: "10px", fontSize: "18px" }}>
          Join Game
        </button>
      )}
  
      {waitingForOpponent && <h2>Waiting for another player...</h2>}
  
      {!winner && !waitingForOpponent && question && (
        <div>
          <h2>{question.text}</h2>
          {Array.isArray(question.options) ? (
            question.options.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleSubmitAnswer(index)}
                disabled={selectedAnswer !== null}
                style={{
                  display: "block",
                  margin: "10px auto",
                  padding: "10px",
                  fontSize: "18px",
                  backgroundColor: selectedAnswer === index ? "lightblue" : "white",
                }}
              >
                {choice}
              </button>
            ))
          ) : (
            <p>Loading choices...</p>
          )}
        </div>
      )}
  
      {winner && (
        <div>
          <h2>Game Over!</h2>
          <p>Winner: {winner}</p>
          <p>{players.player1} Score: {scores.player1}</p>
          <p>{players.player2} Score: {scores.player2}</p>
        </div>
      )}
    </div>
  );
}

export default Quiz;
