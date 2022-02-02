"use strict";

// Load User model
const { models } = require("../models");
const { Course } = models;

// exports.userIsOwner = async (req, res) => {
//   try {
//     const course = await Course.findOne({ where: { id: req.params.id } });
//     const { userId } = course.dataValues;

//     if (userId) {
//       console.log("a user id exists");
//     }

//     // If the associated userId matches the authenticated user's ID, update the course
//     if (req.currentUser.id == userId) {
//       console.log("returning true");
//       return true;
//     } else {
//       console.log("returning false");
//       // return false;
//       res.status(400).json({ message: "No corresponding course exists" });
//     }
//   } catch (error) {
//     console.log(`There was an error in the userIsOwner function`);
//   }
// };

exports.userIsOwner = async (req, res, next) => {
  console.log(`Initiating userIsOwner middleware!`);
  try {
    const course = await Course.findOne({ where: { id: req.params.id } });
    const { userId } = course.dataValues;

    if (userId) {
      console.log("a user id exists");
    }

    // If the associated userId matches the authenticated user's ID, update the course
    if (req.currentUser.id == userId) {
      console.log("returning true");
      next();
    } else {
      console.log("returning false");
      // return false;
      res.status(400).json({ message: "IDs do not match" });
    }
  } catch (error) {
    console.log(`A course with this ID was not located in the dataset.`);
    res.status(400).json({
      message: "A course with this ID was not located in the dataset",
    });
  }
};
