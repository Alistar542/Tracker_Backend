const router = require("express").Router();
let Course = require("../models/courses.model");

router.route("/add").post((req, res) => {
  const courseName = req.body.courseName;
  const country = req.body.country;
  const description = req.body.description;
  const university = req.body.university;
  const duration = req.body.duration;

  const newCourse = new Course({
    courseName,
    country,
    description,
    university,
    duration,
  });

  newCourse
    .save()
    .then(() => res.json("Course added"))
    .catch((err) => res.status(400).json("Error :" + err));
});

module.exports = router;
