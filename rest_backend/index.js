// rest server

const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require('cors');

// import mongodb
const connectMongoDB = require("./db.js")

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
connectMongoDB();

// Create an HTTP server
const server = http.createServer(app);

// Run API Server
const API_PORT = process.env.API_PORT | 9000;
server.listen(API_PORT, () => {
  console.log(`🚀 API Server running on port ${API_PORT}`);
});
