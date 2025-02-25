const express = require("express");
const GameSession = require("../models/GameSession");
const Question = require("../models/Question");
const router = express.Router();
const { VALIDATION_RULES } = require("../constants/rest_constants");


// start a new game session
router.post("/start", async (req, res) => {
  try {
    const { player1, player2 } = req.body;

    if (!player1 || !player2) {
      return res.status(400).json({ error: "Both players are required" });
    }

    // fetch 4 random questions from the database
    const questions = await Question
      .aggregate([{ $sample: { size: VALIDATION_RULES.MAX_QUESTIONS_IN_GAME } }]);

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
      _id: game._id,
      player1,
      player2,
      questions: questions.map((q) => ({
        _id: q._id
      })),
    });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ error: error.message });
  }
});


// update game session to mark as completed
router.patch("/end/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    // Fetch the game session from the database
    const game = await GameSession.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Mark the game as completed
    game.isCompleted = true;

    // Save the updated game session
    await game.save();

    res.status(200).json({
      message: "Game marked as completed",
      gameId: game._id,
      isCompleted: game.isCompleted,
    });
  } catch (error) {
    console.error("Error marking game as completed:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
