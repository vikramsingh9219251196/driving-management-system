const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDb = require('./config/db.config');

// Import routes
const authRoutes = require('./routers/auth.routes');
const drivingCourseRoutes = require('./routers/drivingCourse.routes');
const miscellaneousRoutes = require('./routers/miscellaneous.routes');

dotenv.config();

const app = express();

// Configure CORS with multiple origins
const allowedOrigins = [
    'http://localhost:3000', // Development frontend
    'https://cdl-onedrive-realty.vercel.app' // Production frontend
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectToDb();

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Driving Management System API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/driving-courses', drivingCourseRoutes);
app.use('/api', miscellaneousRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    // Handle specific errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token or not authorized'
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            status: 'error',
            message: 'File size limit exceeded'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
