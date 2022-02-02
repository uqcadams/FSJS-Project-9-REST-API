"use strict";

// Import modules
const express = require("express");
const auth = require("basic-auth");

// Construct a router instance.
const router = express.Router();

// Import the model datasets
const { models } = require("./models");
const { validateInput } = require("./utils/validate");
const { authenticateUser } = require("./middleware/auth-user");
const { userIsOwner } = require("./utils/userIsOwner");
const { User, Course } = models;

// Association Options
const associationOptions = {
  model: User,
  as: "associatedUser",
};

const userExclusions = {
  attributes: {
    exclude: ["password", "createdAt", "updatedAt"],
  },
};

// Handler function to wrap each route
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

// Express middleware to expect JSON data via the request body
router.use(express.json());

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
    res.status(200).json(user);
  } catch (error) {
    // Return the error
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
      res.status(400).json({ errors });
    } else {
      await User.create(req.body);
      res.status(201).set({ Location: "/" }).end();
    }
  } catch (error) {
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
    res.status(200).json(courses);
  } catch (error) {
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
      res.status(200).json(course);
    } else {
      // Return a message that no corresponding course was found.
      res.status(400).json({ message: "No course was found with that id." });
    }
  } catch (error) {
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
      res.status(400).json({ errors });
    } else {
      // Otherwise, create a new course using the user input
      let course = await Course.create(req.body);
      res
        .status(201)
        .set({ Location: `/courses/${course.dataValues.id}` })
        .end();
    }
  } catch (error) {
    res.status(400).json({ message: "That didn't work, bud!" });
  }
});

// UPDATE specific course
router.put("/courses/:id", authenticateUser, userIsOwner, async (req, res) => {
  try {
    const validationFields = ["title", "description"]; // Define input validation fields

    const errors = validateInput(req.body, validationFields); // Pass user details and validation fields to input validation helper function

    if (errors.length > 0) {
      // If the error array is populated, throw an error and return error messages to user.
      res.status(400).json({ errors });
    } else {
      // Otherwise, try to locate the course and isolate the associated userId value
      try {
        await Course.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
        res.status(204).end();
      } catch (error) {
        res.status(400).json({ message: "No corresponding course exists" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "An error has occurred", error });
  }
});

// DELETE specific course
router.delete(
  "/courses/:id",
  authenticateUser,
  userIsOwner,
  async (req, res) => {
    try {
      await Course.destroy({
        where: {
          id: req.params.id,
        },
      });
      console.log("The record was succesfully deleted from the dataset.");
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: "An error has occurred", error });
    }
  }
);

module.exports = router;
