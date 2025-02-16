const ERROR_MESSAGES = {
    INVALID_TEXT: "Question text is required and must be a string.",
    INVALID_OPTIONS: "Options must be an array of 4 items.",
    INVALID_ANSWER: "Correct answer must be a valid index of the options array.",
  };
  
  const VALIDATION_RULES = {
    MIN_OPTIONS: 4,
    ANSWER_TYPE: "number",
    TEXT_TYPE: "string",
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 6,
    MAX_USERNAME_LENGTH: 20,
    MAX_PASSWORD_LENGTH: 30
  };
  
  module.exports = { ERROR_MESSAGES, VALIDATION_RULES };
  