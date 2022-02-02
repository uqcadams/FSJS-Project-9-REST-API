# FSJS-Project-9-REST-API

Full Stack JavaScript Project 9 - REST API

# Change log:

[31 Jan 2022] - Changed port from 5000 to 3000 in app.js to avoid macOS Monterey issue.
[31 Jan 2022] - Implemented database, model, and association configurations.
[01 Feb 2022] - Implemented basic routing and validation functionalities.
[02 Feb 2022] - Designed and implemented custom input validation helper function to reduce code bloat.
[02 Feb 2022] - Implemented custom user authentication middleware.

# Notes:

Interesting - when generating foreign keys via associations, it takes the target model name and the target primary key name, and concatenates them in camelCase. So by defining the target model {as: "user"}, and in the User model the primary key is named "id", then the concatenation becomes userId. Interesting!

// // DELETE specific course
// router.delete("/courses/:id", authenticateUser, async (req, res) => {
// // Otherwise, try to locate the course and isolate the associated userId value
// try {
// const course = await Course.findOne({ where: { id: req.params.id } });
// const { userId } = course.dataValues;

// // If the associated userId matches the authenticated user's ID, update the course
// if (req.currentUser.id == userId) {
// await Course.destroy({
// where: {
// id: req.params.id,
// },
// });
// res.status(204).end();
// } else {
// // Otherwise, return a 403 error and reject the authentication match
// res.status(403).json({
// message: "You are not the authenticated owner of this resource",
// });
// }
// } catch (error) {
// res.status(400).json({ message: "An error has occurred", error });
// }
// });
