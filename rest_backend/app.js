const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// import MongoDB connection
const connectMongoDB = require("./db");

// import Routes
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");
const questionRoutes = require("./routes/question");

// load environment variables
dotenv.config();

// initialize express app
const app = express();

// middlewares
app.use(bodyParser.json()); 
app.use(cors());
app.use(express.json());

// middleware to handle JSON errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

// connect to MongoDB
connectMongoDB();

// define API routes
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);
app.use("/question", questionRoutes);

module.exports = app;
