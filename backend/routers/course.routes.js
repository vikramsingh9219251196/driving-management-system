const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseById,
  deleteCourseLecture,
  updateCourseLecture,
} = require("../controllers/course.controller.js");

const {
  isLoggedIn,
  authorisedRoles,
  authorizeSubscriber,
} = require("../middleware/auth.middleware.js");

const upload = require("../middleware/multer.middleware.js");

router
  .route("/")
  .get(getAllCourses)
  .post(
    isLoggedIn,
    authorisedRoles("ADMIN"),
    upload.single("thumbnail"),
    createCourse
  )
  .delete(
    isLoggedIn,
    authorisedRoles("ADMIN"),
    deleteCourseLecture
  )
  .put(
    isLoggedIn,
    authorisedRoles("ADMIN"),
    upload.single("lecture"),
    updateCourseLecture
  );

router
  .route("/:id")
  .get(isLoggedIn, authorizeSubscriber, getLecturesByCourseId)
  .put(
    isLoggedIn,
    authorisedRoles("ADMIN"),
    upload.single("thumbnail"),
    updateCourse
  )
  .delete(isLoggedIn, authorisedRoles("ADMIN"), removeCourse)
  .post(
    isLoggedIn,
    authorisedRoles("ADMIN"),
    upload.single("lecture"),
    addLectureToCourseById
  );

module.exports = router;
