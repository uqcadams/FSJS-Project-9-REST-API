"use strict";

// Load dependencies
const auth = require("basic-auth");
const bcrypt = require("bcryptjs");

// Load User model
const { User } = require("../models");

// Middleware to authenticate the request using Basic Authentication
exports.authenticateUser = async (req, res, next) => {
  // Initialise an empty variable to store the custom response message.
  let message = "";

  // Parse the users credentials from the Authorization header
  const credentials = auth(req);

  // If credentials are returned...
  if (credentials) {
    // Search for user with matching email in dataset
    const user = await User.findOne({
      where: {
        emailAddress: credentials.emailAddress,
      },
    });
    // If the user exists in the dataset...
    if (user) {
      // Hash and compare the provided credentials and those in database
      const authenticated = bcrypt.compareSync(
        credentials.password,
        user.confirmedPassword
      );
      // If the passwords match and the user is authenticated...
      if (authenticated) {
        console.log(
          `Authentication successful for user with email: ${user.emailAddress}`
        );
        req.currentUser = user;
      } else {
        message = `Authentication failure for user with email: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for email: ${credentials.emailAddress}`;
    }
  } else {
    message = `Authentication header not found`;
  }

  // If an error message exists...
  if (message) {
    // Deny access and inform the user
    console.warn(message);
    res.status(401).json({ message: "Access Denied!" });
  } else {
    // Continue to the appropriate route
    next();
  }
};
