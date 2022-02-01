"use strict";

// Import modules
const express = require("express");
const auth = require("basic-auth");

// Construct a router instance.
const router = express.Router();

// Import the model datasets
const { models } = require("./models");
const { validateInput } = require("./utils/validate");
const { User, Course } = models;

// Association Options
const associationOptions = {
  model: User,
  as: "associatedUser",
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

// GET home index page populated with full book dataset
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Fetch the full book list from the database, sort by year
    const userList = await Course.findAll();

    res.json(userList);
  })
);

/***************/
/* USER ROUTES */
/***************/

// GET all properties and values for the currently authenticated User
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    // Store the user credentials from the request
    const credentials = auth(req);
    // Search for match in dataset
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });
    // Set status to 200 and return user data
    res.status(200).json(user);
  })
);

// POST a new user
// router.post("/users", async (req, res) => {
//   try {
//     await User.create(req.body);
//     res
//       .status(201)
//       .set({ Location: "/" })
//       .json({ message: "Account successfully created!" }); // Delete later, no content required here
//   } catch (error) {
//     res.status(400).json({ message: "That didn't work, bud!" });
//   }
// });

router.post("/users", async (req, res) => {
  try {
    // Get the user from the request body
    const user = req.body;

    // Initialise an empty array for error messages
    const errors = [];

    // Define input validation fields
    const validationFields = [
      "firstName",
      "lastName",
      "emailAddress",
      "password",
    ];

    // Pass user details and validation fields to input validation helper function
    validateInput(user, validationFields);

    // If there are any errors...
    if (errors.length > 0) {
      res.status(400).json({ errors });
    } else {
      await User.create(req.body);
      res
        .status(201)
        .set({ Location: "/" })
        .json({ message: "Account successfully created!" }); // Delete later, no content required here
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "That didn't work, bud!", error });
  }
});

/*****************/
/* COURSE ROUTES */
/*****************/

// GET all courses including associated user for each course
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    try {
      // Find all courses and their user associations and store them in variable "courses"
      const courses = await Course.findAll({
        include: [associationOptions],
      });
      // Return status 200 and course collection
      res.status(200).json(courses);
    } catch (error) {
      res.json(error);
    }
  })
);

// GET specific course and associated user
router.get("/courses/:id", async (req, res) => {
  try {
    // Attempt to find a course that matches the id provided in the params
    const course = await Course.findOne({
      where: {
        id: req.params.id,
      },
      include: [associationOptions],
    });
    // Return the course and association data
    res.status(200).json(course);
  } catch (error) {
    res.json(error);
  }
});

// POST new course
router.post("/courses", async (req, res) => {
  try {
    // Attempt to create a new course using data provided in the request body
    await Course.create(req.body);
    res
      .status(201)
      .set({ Location: "/" })
      .json({ message: "Course successfully added!" }); // Delete later, no content to be returned
  } catch (error) {
    res.status(400).json({ message: "That didn't work, bud!" });
  }
});

// UPDATE specific course
router.put("/courses/:id", async (req, res) => {
  try {
    // Store the request body content
    const course = req.body;

    // Update course with new details
    await Course.update(course, {
      where: {
        id: req.params.id,
      },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: "That didn't work, bud!" });
  }
});

// DELETE specific course
router.delete("/courses/:id", async (req, res) => {
  try {
    await Course.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
