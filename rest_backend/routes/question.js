const express = require('express');
const Question = require('../models/Question');
const validateQuestion = require("../utils/validate_question.js");

const router = express.Router();


// get a question by id
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// add a new question
router.post('/', async (req, res) => {
  try {
    const validationResult = validateQuestion(req.body);

    if (!validationResult.valid) {
      return res.status(400).json({ error: validationResult.error });
    }

    // create and save question
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
