"use strict";

// Import modules
const express = require("express");
const auth = require("basic-auth");

// Construct a router instance.
const router = express.Router();

// Import the model datasets
const { models } = require("./models");
const { User, Course } = models;

// Middleware
const { authenticateUser } = require("./middleware/auth-user");
const { userIsOwner } = require("./middleware/userIsOwner");

// Express middleware to expect JSON data via the request body
router.use(express.json());

// Utils
const { validateInput } = require("./utils/validate");
const { logSuccessFont, logErrorFont } = require("./utils/logFonts"); // a visible log font colours for successful/unsuccessful interactions.

// Association Options
const associationOptions = {
  model: User,
  as: "associatedUser",
};

// Pre-defined user exclusions to prevent returning of passwords across queries.
const userExclusions = {
  attributes: {
    exclude: ["password", "createdAt", "updatedAt"],
  },
};

/***************/
/* USER ROUTES */
/***************/

// GET all properties and values for the currently authenticated User
router.get("/users", authenticateUser, async (req, res) => {
  try {
    // Store the user credentials from the request
    const credentials = auth(req);

    // Search for match in dataset
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
      ...userExclusions, // Loads exclusions for user data (password & timestamps)
    });

    // Set status to 200 and return user data
    console.log(
      logSuccessFont,
      "User records have been successfully returned for the authenticated user"
    );
    res.status(200).json(user);
  } catch (error) {
    // Return the error
    console.log(
      logErrorFont,
      `An error occurred while attempting to return records for the authenticated user. Error reference: ${error.message}.`
    );
    res.status(400).json({ error });
  }
});

// POST a new user
router.post("/users", async (req, res) => {
  try {
    // Define input validation fields
    const validationFields = [
      "firstName",
      "lastName",
      "emailAddress",
      "password",
    ];

    // Pass user details and validation fields to input validation helper function
    const errors = validateInput(req.body, validationFields);
    // Check if there are any errors...
    if (errors.length > 0) {
      console.log(
        logErrorFont,
        `Input validation errors prevented a new user record from being created.`
      );
      res.status(400).json({ errors });
    } else {
      await User.create(req.body);
      console.log(
        logSuccessFont,
        "A new user record has been successfully added to the database."
      );
      res.status(201).set({ Location: "/" }).end();
    }
  } catch (error) {
    console.log(
      logErrorFont,
      `An error occurred while attempting to add a new user record to the database. Error reference: ${error.message}.`
    );
    res.status(400).json({ error });
  }
});

/*****************/
/* COURSE ROUTES */
/*****************/

// GET all courses including associated user for each course
router.get("/courses", async (req, res) => {
  try {
    // Find all courses and their user associations and store them in variable "courses"
    const courses = await Course.findAll({
      include: [
        {
          ...associationOptions,
          ...userExclusions,
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    // Return status 200 and course collection
    console.log(
      logSuccessFont,
      "All course records and their associations have been successfully returned."
    );
    res.status(200).json(courses);
  } catch (error) {
    console.log(
      logErrorFont,
      "An error occurred while attempting to return all course records and their associations."
    );
    res.status(400).json(error);
  }
});

// GET specific course and associated user
router.get("/courses/:id", async (req, res) => {
  try {
    // Attempt to find a course that matches the id provided in the params
    const course = await Course.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          ...associationOptions,
          ...userExclusions,
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (course) {
      // Return the course and association data
      console.log(
        logSuccessFont,
        `Course records for "${course.dataValues.title}" have successfully been retrieved from the database.`
      );
      res.status(200).json(course);
    } else {
      // Return a message that no corresponding course was found.
      console.log(
        logErrorFont,
        `The requested course record does not exist in the database. Reference ID: ${req.params.id}`
      );
      res.status(400).json({ message: "No course was found with that id." });
    }
  } catch (error) {
    console.log(
      logErrorFont,
      "An error occurred while attempting to retrieve course records from the database."
    );
    res.status(400).json(error);
  }
});

// POST new course
router.post("/courses", authenticateUser, async (req, res) => {
  try {
    // Define input validation fields
    const validationFields = ["title", "description"];

    // Pass user details and validation fields to input validation helper function
    const errors = validateInput(req.body, validationFields);

    // Check if there are any errors...
    if (errors.length > 0) {
      // If errors exist, return the error object
      console.log(
        logErrorFont,
        `Input validation errors prevented a new course record from being created.`
      );
      res.status(400).json({ errors });
    } else {
      // Otherwise, create a new course using the user input
      let course = await Course.create(req.body);
      console.log(
        logSuccessFont,
        "A new course record has been successfully added to the database."
      );
      res
        .status(201)
        .set({ Location: `/courses/${course.dataValues.id}` })
        .end();
    }
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      console.log(
        logErrorFont,
        "An error occurred while attempting to add a new course record to the database."
      );
      res
        .status(500)
        .json({
          message:
            "An error occurred while attempting to add a new course record to the database.",
        });
    }
  }
});

// UPDATE specific course
router.put("/courses/:id", authenticateUser, userIsOwner, async (req, res) => {
  try {
    // Define input validation fields
    const validationFields = ["title", "description"];

    // Pass user details and validation fields to input validation helper function
    const errors = validateInput(req.body, validationFields);

    // If the error array is populated, throw an error and return error messages to user.
    if (errors.length > 0) {
      console.log(
        logErrorFont,
        `Input validation errors prevented a course record from being updated.`
      );
      res.status(400).json({ errors });
    } else {
      // Otherwise, update the course record with the new data.
      try {
        await Course.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
        console.log(
          logSuccessFont,
          `A record was successfully updated in the dataset by an authorised user.`
        );
        res.status(204).end();
      } catch (error) {
        console.log(
          logErrorFont,
          `An error occurred while attempting to locate the requested course resource. It may not exist in the dataset. Reference ID: ${req.params.id}`
        );
        res.status(400).json({
          message:
            "An error occurred while attempting to locate the requested course resource. It may not exist in the dataset.",
        });
      }
    }
  } catch (error) {
    console.log(
      logErrorFont,
      "An error occurred while attempting to validate user input."
    );
    res.status(400).json({
      message: "An error has occurred while attempting to validate your input.",
      error,
    });
  }
});

// DELETE specific course
router.delete(
  "/courses/:id",
  authenticateUser,
  userIsOwner,
  async (req, res) => {
    try {
      // Attempt to destroy the corresponding course from the dataset.
      await Course.destroy({
        where: {
          id: req.params.id,
        },
      });
      console.log(
        logSuccessFont,
        "The record was successfully deleted from the dataset."
      );
      res.status(204).end();
    } catch (error) {
      console.log(
        logErrorFont,
        "An error occurred while attempting to delete the record from the dataset."
      );
      res.status(400).json({
        message:
          "An error has occurred while attempting to delete the record from the dataset",
        error,
      });
    }
  }
);

module.exports = router;
