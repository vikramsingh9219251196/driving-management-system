// server/src/controllers/auth.controller.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name, confirmPassword } = req.body;
  
      if (!email || !password || !name || !confirmPassword) {
        return res.status(400).json({ message: 'Please provide all fields' });
      }
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }
  
      const user = new User({
        email,
        password,
        name,
      });
  
      await user.save();
  
      const token = jwt.sign(
        { userId: user._id,
          role: user.role
         },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role  
        }
      });
    } catch (error) {
      console.error('Error during registration:', error); 
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id,
          role: user.role
         },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role  
        },
      });
  
      
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
},

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.userId).select('+password');
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ message: error.message });
    }
  }
  
};

module.exports = authController;
