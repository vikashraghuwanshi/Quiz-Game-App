const express = require("express");
const GameSession = require("../models/GameSession");
const Question = require("../models/Question");
const router = express.Router();

// start a new game session
router.post("/start", async (req, res) => {
  try {
    const { player1, player2 } = req.body;

    if (!player1 || !player2) {
      return res.status(400).json({ error: "Both players are required" });
    }

    // fetch 4 random questions from the database
    const questions = await Question.aggregate([{ $sample: { size: 4 } }]);

    if (!questions.length) {
      return res.status(400).json({ error: "No questions available" });
    }

    // create a new game session with question IDs
    const game = new GameSession({
      player1,
      player2,
      questions: questions.map((q) => q._id),
    });

    await game.save();

    // send full questions in the response
    res.status(201).json({
      gameId: game._id,
      player1,
      player2,
      questions: questions.map((q) => ({
        _id: q._id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
