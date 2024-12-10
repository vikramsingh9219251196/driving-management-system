const mongoose = require('mongoose');

const drivingCourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    courseType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    thumbnail: {
      public_id: String,
      secure_url: String,
    },
    lessons: [
      {
        lessonNumber: Number,
        title: String,
        description: String,
        duration: Number,
        lessonType: String,
        materials: {
          public_id: String,
          secure_url: String,
        },
      },
    ],
    numberOfLessons: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DrivingCourse = mongoose.model('DrivingCourse', drivingCourseSchema);

module.exports = DrivingCourse;
