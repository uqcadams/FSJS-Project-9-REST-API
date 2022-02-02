"use strict";

// Load Course model
const { models } = require("../models");
const { Course } = models;

// Utils
const { logErrorFont, logSuccessFont } = require("../utils/logFonts");

/**
 * Evaluates whether the user requesting a put or delete request is the owner of the resource they are attempting the modify.
 *
 */
exports.userIsOwner = async (req, res, next) => {
  try {
    // Attempt to locate the course record and extract the associated userId.
    const course = await Course.findOne({ where: { id: req.params.id } });
    const { userId } = course.dataValues;

    // If the associated userId matches the authenticated user's ID, proceed.
    if (req.currentUser.id == userId) {
      console.log("User is authenticated for resource modification.");
      next();
    } else {
      // If IDs do not match, reject the request and return an error message.
      console.log(
        logErrorFont,
        "User has not been authenticated for resource modification."
      );
      res
        .status(400)
        .json({ message: "You are not authorised to modify this record." });
    }
  } catch (error) {
    // Return an error if the course was not located in the dataset.
    console.log(
      logErrorFont,
      `A course with this ID was not located in the dataset. Reference ID: ${req.params.id}.`
    );
    res.status(400).json({
      message: "A course with this ID was not located in the dataset.",
    });
  }
};
