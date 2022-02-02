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

  // Iterate over the defined validation fields and test for inclusion
  validationFields.forEach((field) => {
    if (!userInput[field]) {
      errors.push(`Please provide a value for the "${field}" field!`);
    }

    // Conditional processes if a password field is present.
    if (field === "password" && userInput.password) {
      // Minimum password length threshold implemented
      if (userInput.password.length < 8) {
        errors.push(
          `Your password should be a minimum of 8 characters. It is currently ${
            userInput.password.length
          } characters long. Please add an additional ${
            8 - userInput.password.length
          } characters to proceed.`
        );
      } else {
        // If password is validated, hash the password for security
        userInput.password = bcrypt.hashSync(userInput.password, 10);
      }
    }
  });

  return errors;
};
