"use strict";

// Import modules
const express = require("express");
const { authenticateUser } = require("./middleware/auth-user");

// Construct a router instance.
const router = express.Router();

// Import the model datasets
const User = require("./models").User;
const Courses = require("./models").Course;

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
// GET home index page populated with full book dataset
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Fetch the full book list from the database, sort by year
    const userList = await User.findAll();

    res.json(userList);
  })
);

/* User Routes */

// GET all properties and values for the currently authenticated User
router.get("/users", (req, res) => {
  res.json({ message: "Getting user data!" });
});

// POST a new user
router.post("/users", (req, res) => {
  res.json({ message: "Posting new user data!" });
});

/* Courses Routes */

// GET all courses including associated user
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    res.json({ message: "Getting all course data!" });
  })
);

// GET specific course and associated user
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    res.json({ message: "Getting a specific course!" });
  })
);

// POST new course
router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    res.json({ message: "Posting new course data!" });
  })
);

// UPDATE specific course
router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    res.json({ message: "Updating a specific course content!" });
  })
);

// DELETE specific course
router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    res.json({ message: "Deleting a specific course :-( " });
  })
);

module.exports = router;
