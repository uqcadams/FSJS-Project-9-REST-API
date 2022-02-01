# FSJS-Project-9-REST-API

Full Stack JavaScript Project 9 - REST API

# Change log:

[31 Jan 2022] - Changed port from 5000 to 3000 in app.js to avoid macOS Monterey issue.

# Notes:

Interesting - when generating foreign keys via associations, it takes the target model name and the target primary key name, and concatenates them in camelCase. So by defining the target model {as: "user"}, and in the User model the primary key is named "id", then the concatenation becomes userId. Interesting!

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
