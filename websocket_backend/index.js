const WebSocket = require("ws");
const dotenv = require("dotenv");

const { getTokenFromRequest } = require("./utils/utility.js")
const { authenticateWebSocket } = require("./handlers/user_authentication.js");
const { handleMessage } = require("./handlers/message_handler.js");
const { removeDisconnectedPlayer } = require("./handlers/player_manager.js");

dotenv.config();

const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 4000 });

wss.on("connection", (ws, req) => {

    const authResult = authenticateWebSocket(getTokenFromRequest(req));
    if (authResult.error) {
        console.log(`❌ ${authResult.error}. Closing connection.`);
        ws.close();
        return;
    }

    ws.user = authResult.user;

    console.log(`Player ${ws.user.id} connected`)
    ws.on("message", (message) => {
        try {
            // Attach user info and process the message
            handleMessage(ws, message);
        } catch (err) {
            console.log("Error processing message:", err);
        }
    });

    ws.on("close", () => removeDisconnectedPlayer(ws));
});

module.exports = wss;
