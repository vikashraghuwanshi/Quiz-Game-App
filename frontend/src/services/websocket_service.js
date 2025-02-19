let socket = null;

export const initializeWebSocket = (token, onMessage) => {
  if (!token) return;

  socket = new WebSocket(`ws://192.168.1.3:4000?token=${token}`);

  socket.onopen = () => console.log("✅ WebSocket connected");
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📩 Received:", data);
      onMessage(data); // Callback to handle messages in Quiz.js
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.onclose = () => console.log("❌ WebSocket disconnected");
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const joinGame = () => {
  if (socket) {
    socket.send(JSON.stringify({ action: "joinGame" }));
  }
};

export const submitAnswer = (gameId, answerIndex) => {
  if (socket) {
    socket.send(JSON.stringify({ action: "answer:submit", gameId, answerIndex }));
  }
};

export const isWebSocketConnected = () => socket !== null;
