const http = require("http");
const app = require("./app");

// set API port from environment or use default 9000
const API_PORT = process.env.API_PORT || 9000;

// create an HTTP server
const server = http.createServer(app);

// start the server
server.listen(API_PORT, () => {
  console.log(`🚀 API Server running on port ${API_PORT}`);
});
