
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile/update', authMiddleware, authController.updateProfile);
router.put('/profile/change-password', authMiddleware, authController.changePassword);


module.exports = router;




  



