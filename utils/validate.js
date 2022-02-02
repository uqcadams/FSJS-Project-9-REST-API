"use strict";

const bcrypt = require("bcryptjs");

/** Validates user input against potential validation fields
 *
 * @param {object} user - the user input to be validated
 * @param {array} inputFields - the validation fields to be evaluated
 * @returns {array} errors - an array of validation errors
 */
exports.validateInput = (userInput, validationFields) => {
  // Initialise an empty array for error messages
  let errors = [];

  validationFields.forEach((field) => {
    if (!userInput[field]) {
      errors.push(`Please provide a value for the "${field}" field!`);
    }

    if (field === "password" && userInput.password) {
      if (userInput.password.length < 8 || userInput.password.length > 20) {
        errors.push(
          `Your password should be between 8 and 20 characters. It is currently ${userInput.password.length} characters long.`
        );
      } else {
        userInput.password = bcrypt.hashSync(userInput.password, 10);
      }
    }
  });

  return errors;
};
