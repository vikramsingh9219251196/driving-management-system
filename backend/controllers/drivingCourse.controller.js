const drivingCourseModel = require('../models/drivingCourse.model.js');
const AppError = require('../utils/error.utils');
const mongoose = require('mongoose');

const getAllDrivingCourses = async (req, res, next) => {
    try {
        const courses = await drivingCourseModel.find({}).select('-lessons');

        res.status(200).json({
            success: true,
            message: 'All driving courses',
            courses,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Get specific course
const getLessonsByCourseId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await drivingCourseModel.findById(id);
        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Course details',
            course,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Create driving course
const {cloudinary} = require('../config/cloudinary.js');
const fs = require('fs');

const createDrivingCourse = async (req, res, next) => {
    try {
        const { 
            courseName, 
            description, 
            courseType, 
            price,
            vehicleType,
            requirements 
        } = req.body;

        const course = await drivingCourseModel.create({
            courseName,
            description,
            courseType,
            price,
            vehicleType,
            requirements: JSON.parse(requirements),
            createdBy: req.user.userId,
            thumbnail: {
                public_id: '',
                secure_url: ''
            }
        });

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'Driving-Management-System'
                });

                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
                await course.save();
                
                // Fix the template literal syntax
                fs.rmSync(`uploads/${req.file.filename}`);
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                // Handle the error appropriately
                return next(new AppError('Error uploading image', 500));
            }
        }

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};



// Update course
const updateDrivingCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params; // Ensure this matches the route param

        console.log('Update Course - Received Course ID:', courseId);
        console.log('Update Course - Request Body:', req.body);
        console.log('Update Course - Uploaded File:', req.file);

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new AppError('Invalid course ID format', 400));
        }

        // Find the course first
        const course = await drivingCourseModel.findById(courseId);

        if (!course) {
            return next(new AppError('Course with given id does not exist', 404));
        }

        // Update basic course details
        Object.keys(req.body).forEach(key => {
            course[key] = req.body[key];
        });

        if (req.file) {
            if (course.thumbnail && course.thumbnail.public_id) {
                await cloudinary.uploader.destroy(course.thumbnail.public_id);
            }

            // Upload new thumbnail
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Driving-Management-System',
            });

            course.thumbnail = {
                public_id: result.public_id,
                secure_url: result.secure_url
            };

            fs.unlinkSync(req.file.path);
        }

        const updatedCourse = await course.save();

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse
        });

    } catch (error) {
        console.error('Update Course Error:', error);
        return next(new AppError(error.message, 500));
    }
};

// Remove course
const removeDrivingCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params; 
        
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new AppError('Invalid course ID format', 400));
        }

        const course = await drivingCourseModel.findById(courseId);

        console.log('Found Course:', course);

        if (!course) {
            return next(new AppError('Course with given id does not exist', 404));
        }

        if (course.thumbnail && course.thumbnail.public_id) {
            await cloudinary.uploader.destroy(course.thumbnail.public_id);
        }

        const deletedCourse = await drivingCourseModel.findByIdAndDelete(courseId);

        console.log('Deleted Course:', deletedCourse);

        if (!deletedCourse) {
            return next(new AppError('Failed to delete course', 500));
        }

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (e) {
        console.error('Delete Course Error:', e);
        return next(new AppError(e.message, 500));
    }
};

const addLessonToCourseById = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { title, description } = req.body;
  
      if (!req.file) return next(new AppError('Video file is required', 400));
  
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'video',
        folder: 'Driving-Management-System/lessons',
      });
  
      const lesson = {
        title,
        description,
        materials: {
          public_id: result.public_id,
          secure_url: result.secure_url,
        },
      };
  
      const course = await drivingCourseModel.findByIdAndUpdate(
        courseId,
        { 
            $push: { lessons: lesson },
            $inc: { numberOfLessons: 1 }  
        },
        { new: true }
    );
  
      if (!course) throw new AppError('Course not found', 404);

      if (req.file.path) fs.rmSync(req.file.path, { force: true });
  
      res.status(200).json({
        success: true,
        message: 'Lesson added successfully',
        course,
      });
    } catch (error) {
      if (req.file?.path) fs.rmSync(req.file.path, { force: true });
      return next(new AppError(error.message || 'Failed to add lesson', 500));
    }
  };

  const updateCourseLesson = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return next(new AppError('Title and description are required', 400));
        }

        const course = await drivingCourseModel.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const lessonIndex = course.lessons.findIndex(
            (lesson) => lesson._id.toString() === lessonId
        );

        if (lessonIndex === -1) {
            return next(new AppError('Lesson not found in the course', 404));
        }

        const updatedLessonData = {
            ...course.lessons[lessonIndex].toObject(),
            title,
            description,
        };

        // Handle new video upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
                folder: "Driving-Management-System/lessons",
                eager: [
                    { format: "mp4", quality: "auto" } // Removed streaming_profile
                ],
                eager_async: true,
                chunk_size: 6000000 
            });

            if (course.lessons[lessonIndex].materials?.public_id) {
                await cloudinary.uploader.destroy(
                    course.lessons[lessonIndex].materials.public_id,
                    { resource_type: 'video' }
                );
            }

            // Update materials with new video info
            updatedLessonData.materials = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };

            // Clean up temp file
            if (req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting temporary file:', err);
                });
            }
        }

        // Update the lesson in the course
        course.lessons[lessonIndex] = updatedLessonData;
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lesson updated successfully',
            course,
        });
    } catch (e) {
        if (req.file?.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temporary file:', err);
            });
        }
        return next(new AppError(e.message || 'Failed to update lesson', 500));
    }
};





const deleteCourseLesson = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.params;

        const course = await drivingCourseModel.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const lessonIndex = course.lessons.findIndex(
            (lesson) => lesson._id.toString() === lessonId
        );

        if (lessonIndex === -1) {
            return next(new AppError('Lesson not found in the course', 404));
        }

        // Delete lesson material from Cloudinary
        const lessonMaterial = course.lessons[lessonIndex].materials;
        if (lessonMaterial && lessonMaterial.public_id) {
            await cloudinary.uploader.destroy(lessonMaterial.public_id);
        }

        course.lessons.splice(lessonIndex, 1);
        course.numberOfLessons = course.lessons.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lesson deleted successfully',
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};


// Update lesson



  

module.exports = {
    getAllDrivingCourses,
    getLessonsByCourseId,
    createDrivingCourse,
    updateDrivingCourse,
    removeDrivingCourse,
    addLessonToCourseById,
    deleteCourseLesson,
    updateCourseLesson,
};
