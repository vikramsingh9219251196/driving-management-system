const DrivingCourse = require('../models/drivingCourse.model.js');
const User = require('../models/User.js');
const AppError = require('../utils/error.utils');
const sendEmail = require('../utils/sendEmail.js');

const contactUs = async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new AppError("All fields are required", 400));
    }

    try {
        const emailMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

        await sendEmail(
            process.env.CONTACT_US_EMAIL,
            "Contact Us",
            emailMessage,
        );

        const userMessage = `Hello ${name},\n\nThank you for contacting us! We have received your message and will get in touch with you soon.\n\nBest regards,\nThe DrivingTeam Team 😊`;

        await sendEmail(
            email,
            'Thank You for Contacting Us',
            userMessage,
        );

        res.status(200).json({
            success: true,
            message: "Thanks for contacting. We have sent you a confirmation email and will get in touch with you soon.",
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const stats = async (req, res, next) => {
    try {
        const allUsers = await User.find({ role: 'user' }).select('-password');
        const allUsersCount = allUsers.length;
        
        const allCourses = await DrivingCourse.find().populate('lessons');
    
        const totalVideos = allCourses.reduce((total, course) => {
            return total + (course.numberOfLessons || 0);
        }, 0);

        res.status(200).json({
            success: true,
            message: 'Stats retrieved successfully',
            stats: {
                allUsersCount,
                totalCourses: allCourses.length,
                totalVideos,
                courses: allCourses
            }
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};




module.exports = { contactUs, stats };
