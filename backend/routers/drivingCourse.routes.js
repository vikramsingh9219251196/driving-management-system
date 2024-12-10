
const express = require("express");
const router = express.Router();

const {
  getAllDrivingCourses,
  getLessonsByCourseId,
  createDrivingCourse,
  updateDrivingCourse,
  removeDrivingCourse,
  addLessonToCourseById,
  deleteCourseLesson,
  updateCourseLesson,
} = require("../controllers/drivingCourse.controller.js");

const authMiddleware = require("../middleware/auth.middleware.js");
const roleCheck = require("../middleware/roleCheck.middleware.js");
const upload = require("../middleware/multer.middleware.js");
const { videoUpload } = require("../config/cloudinary");

router.get("/", getAllDrivingCourses);
router.get("/:id", getLessonsByCourseId);

router.post(
  "/",
  authMiddleware,
  roleCheck(["admin"]),
  upload.single("thumbnail"),
  createDrivingCourse
);

router.post(
  "/:courseId/lesson",
  authMiddleware,
  roleCheck(["admin"]),
  videoUpload.single("materials"),
  addLessonToCourseById
);

router.put(
  "/:courseId/lesson/:lessonId",
  authMiddleware,
  roleCheck(["admin"]),
  videoUpload.single("materials"),
  updateCourseLesson
);

router.delete(
  "/:courseId/lesson/:lessonId",
  authMiddleware,
  roleCheck(["admin"]),
  deleteCourseLesson
);

router.delete(
  "/:courseId", 
  authMiddleware,
  roleCheck(["admin"]),
  removeDrivingCourse
);
router.put(
  "/:courseId",
  authMiddleware,
  roleCheck(["admin"]),
  upload.single("thumbnail"),
  updateDrivingCourse
);

module.exports = router;
