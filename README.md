# FSJS-Project-9-REST-API

Full Stack JavaScript Project 9 - REST API

Author: Chris Adams
Date: 02/02/2022

# Change log:

[31 Jan 2022] - Changed port from 5000 to 3000 in app.js to avoid macOS Monterey issue.
[31 Jan 2022] - Implemented database, model, and association configurations.
[01 Feb 2022] - Implemented basic routing and validation functionalities.
[02 Feb 2022] - Designed and implemented custom input validation helper function to reduce code bloat.
[02 Feb 2022] - Implemented custom user authentication middleware.
[02 Feb 2022] - Completed routing and postman tests.
[02 Feb 2022] - Added custom console log colors and misc util functions to assist readability.

# Notes:

This project establishes a number of routes to create, read, update, and delete user and course records within the provided database. It includes authentication and validation requirements, and requires user validation and matching for updating or deleting restricted resources.

Some notable additions beyond the initial scope of the project:

1. userIsOwner.js acts as express middleware for certain routes to determine whether the user attempting to modify or delete resources matches the associated owner of the resource. When the user's id and the courses associated userId field match, the middleware proceeds to the intended functionalities. When the match fails, an error is thrown and the user (authorised or not) is not permitted to access or edit those resources.

2. validate.js acts as a utility function to simplify the validation process. Routes define custom validation fields in the form of an array of strings, which are then iterated over using the validation function. This creates a more dynamic and scalable solution for input validation.

3. logFonts.js is a simple color-modifying utility module that modifies the node.js console font colours, to aid in the legibility of process errors and successes. The provides additional feedback to the developer.

4. In routes.js, model associations and result exclusions have been stored in variables to reduce bloating. userExclusions standardise the results returned for user details, and ensures that when course records are pulled, they don't bring with them the associated user password details. These are included within the routes using spread operators.

I chose not to use an asyncHandler function for this implementation, as I felt it gave me greater control in understanding the process of route development and implementation.
