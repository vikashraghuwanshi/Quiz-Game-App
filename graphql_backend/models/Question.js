const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      minlength: [5, "Question must be at least 5 characters long"],
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: function (arr) {
          return arr.length === 4;
        },
        message: "Options must contain exactly 4 choices",
      },
    },
    correctAnswer: {
      type: Number,
      required: [true, "Correct answer index is required"],
      min: [0, "Correct answer index cannot be negative"],
      max: [3, "Correct answer index must be within the options array"],
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Question", QuestionSchema);
