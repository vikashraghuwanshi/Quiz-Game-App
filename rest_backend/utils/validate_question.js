function validateQuestion(question) {
    const { text, options, correctAnswer } = question;
  
    if (!text || typeof text !== "string" || text.trim() === "") {
      return { valid: false, error: "Question text is required and must be a string." };
    }
  
    if (!Array.isArray(options) || options.length < 4 || options.some(opt => typeof opt !== "string")) {
      return { valid: false, error: "Options must be an array of 4 items." };
    }
  
    if (typeof correctAnswer !== "number" || correctAnswer < 0 || correctAnswer >= options.length) {
      return { valid: false, error: "Correct answer must be a valid index of the options array." };
    }
  
    return { valid: true };
  }
  
  module.exports = validateQuestion;
  