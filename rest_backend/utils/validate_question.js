const { ERROR_MESSAGES, VALIDATION_RULES } = require("../constants/rest_constants");

function validateQuestion(question) {
  const { text, options, correctAnswer } = question;

  if (!text || typeof text !== VALIDATION_RULES.TEXT_TYPE || text.trim() === "") {
    return { valid: false, error: ERROR_MESSAGES.INVALID_TEXT };
  }

  if (!Array.isArray(options) || options.length < VALIDATION_RULES.MIN_OPTIONS || options.some(opt => typeof opt !== VALIDATION_RULES.TEXT_TYPE)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_OPTIONS };
  }

  if (typeof correctAnswer !== VALIDATION_RULES.ANSWER_TYPE || correctAnswer < 0 || correctAnswer >= options.length) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_ANSWER };
  }

  return { valid: true };
}

module.exports = validateQuestion;
