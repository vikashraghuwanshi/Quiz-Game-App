const { VALIDATION_RULES } = require("../constants/rest_constants");

// function to validate username
const validateUsername = (username) => {
    if (
      !username ||
      typeof username !== VALIDATION_RULES.TEXT_TYPE ||
      username.trim().length < VALIDATION_RULES.MIN_USERNAME_LENGTH ||
      username.trim().length > VALIDATION_RULES.MAX_USERNAME_LENGTH
    ) {
      return `Username must be between ${VALIDATION_RULES.MIN_USERNAME_LENGTH} and ${VALIDATION_RULES.MAX_USERNAME_LENGTH} characters long`;
    }
    return null;
  };

// function to validate password
const validatePassword = (password) => {
    if (
      !password ||
      typeof password !== VALIDATION_RULES.TEXT_TYPE ||
      password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH ||
      password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH
    ) {
      return `Password must be between ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} and ${VALIDATION_RULES.MAX_PASSWORD_LENGTH} characters long`;
    }
    return null;
  };


  module.exports = {
    validateUsername,
    validatePassword,
  };