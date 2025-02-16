const WebSocket = require("ws");
const dotenv = require("dotenv");

const { getTokenFromRequest } = require("./utils/utility.js")
const { authenticateWebSocket } = require("./services/user_authentication.js");
const { handleMessage } = require("./services/message_handler.js");
const { removeDisconnectedPlayer } = require("./services/player_manager.js");

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
            const parsedMessage = JSON.parse(message);
            if (!parsedMessage.token) {
                console.log("❌ Message rejected: No token provided.");
                return;
            }

            const tokenResult = authenticateWebSocket(parsedMessage.token);

            if (tokenResult.error) {
                console.log(`❌ Invalid Token: ${tokenResult.error}`);
                return;
            }

            // Attach user info and process the message
            handleMessage(ws, message);
        } catch (err) {
            console.log("Error processing message:", err);
        }
    });

    ws.on("close", () => removeDisconnectedPlayer(ws));
});

module.exports = wss;
