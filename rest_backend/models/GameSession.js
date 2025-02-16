// models/GameSession.js

const mongoose = require('mongoose');

const GameSessionSchema = new mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    scores: { type: Map, of: Number, default: {} },
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('GameSession', GameSessionSchema);