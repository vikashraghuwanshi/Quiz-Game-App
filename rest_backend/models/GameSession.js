// model game_session

const mongoose = require('mongoose');

const GameSessionSchema = new mongoose.Schema(
  {
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    scores: { type: Map, of: Number, default: {} },
    isCompleted: { type: Boolean, default: false }
  },
  { timestamps: true } // adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('GameSession', GameSessionSchema);