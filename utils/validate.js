"use strict";

const bcrypt = require("bcryptjs");

exports.validateInput = (user, inputFields) => {
  inputFields.forEach((field) => {
    if (!user[field]) {
      errors.push(`Please provide a value for the "${field}" field!`);
    }

    if (field === "password") {
      if (user.password.length < 8 || user.password.length > 20) {
        console.log(`Password is ${user.password}`);
        errors.push("Your password should be between 8 and 20 characters");
      } else {
        user.password = bcrypt.hashSync(user.password, 10);
      }
    }
  });
};
