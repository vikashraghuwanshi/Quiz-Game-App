const WebSocket = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 4000 });

wss.on("connection", (ws, req) => {
    consolve.log("Player Connected")
    ws.on("message", (message) => {
        try {
        console.log("Message received from player : ", message);
        } catch (err) {
        console.log("❌ Error processing message:", err);
        }
    });

    ws.on("close", () => console.log("player disconnected"));
});

module.exports = wss;
