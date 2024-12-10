const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
      minLength: [8, "Title must be at least 8 characters"],
      maxLength: [59, "Title should be less than 60 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [8, "Description must be at least 8 characters"],
      maxLength: [500, "Description should be less than 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    lectures: [
      {
        title: String,
        description: String,
        lecture: {
          public_id: {
            type: String,
          },
          secure_url: {
            type: String,
          },
        },
      },
    ],
    numberOfLectures: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);

module.exports = Course;
