"use strict";

// Import modules
const express = require("express");
const auth = require("basic-auth");

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

// Express middleware to expect JSON data via the request body
router.use(express.json());

// GET home index page populated with full book dataset
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Fetch the full book list from the database, sort by year
    const userList = await Courses.findAll();

    res.json(userList);
  })
);

/* User Routes */

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
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res
        .status(201)
        .set({ Location: "/" })
        .json({ message: "Account successfully created!" });
    } catch (error) {
      res.status(400).json({ message: "That didn't work, bud!" });
    }
  })
);

/* Courses Routes */

// GET all courses including associated user
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    try {
      const courses = await Courses.findAll({
        include: {
          mode: User,
          as: "user",
        },
      });
      res.status(200).json(courses);
    } catch (error) {
      res.json(error);
    }
    // res.json({ message: "Getting all course data!" });
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
