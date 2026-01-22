const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password.utils');
const { generateToken } = require('../utils/jwt.utils');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');

// User Registration
router.post('/register/user', validateRegistration, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber
    });
    
    // Generate token
    const token = generateToken({ id: user.id, type: 'user' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});



// User Login
router.post('/login/user', validateLogin, async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken({ id: user.id, type: 'user' });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});



// Send Verification Code
router.post('/send-verification-code', async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;
    
    // Validate input
    if (!phoneNumber && !email) {
      return res.status(400).json({ message: 'Phone number or email is required' });
    }
    
    // Generate verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
    
    // In a real app, you would send the code via SMS here
    // For now, we'll log it for testing purposes
    console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);
    
    // Store the code temporarily (in a real app, use Redis or database)
    // For demo purposes, we'll store it in memory (not persistent)
    if (!global.verificationCodes) {
      global.verificationCodes = {};
    }
    
    const identifier = phoneNumber; // Only using phone number for SMS verification
    global.verificationCodes[identifier] = {
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    
    res.json({
      message: 'Verification code sent',
      // In production, don't send the code back in response
      // This is just for testing purposes
      // code: verificationCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending verification code' });
  }
});

// Verify Code Only
router.post('/verify-code', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    
    const identifier = phoneNumber; // Only using phone number for SMS verification
    
    // Check if verification code exists and is valid
    if (!global.verificationCodes || !global.verificationCodes[identifier]) {
      return res.status(400).json({ message: 'No verification code found. Please request a new code.' });
    }
    
    const storedCode = global.verificationCodes[identifier];
    
    // Check if code has expired
    if (storedCode.expiresAt < new Date()) {
      delete global.verificationCodes[identifier];
      return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
    }
    
    // Check if code matches
    if (storedCode.code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    // Code is valid, return success
    res.status(200).json({
      message: 'Verification successful',
      valid: true
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// Create User Profile After Verification
router.post('/create-profile', async (req, res) => {
  try {
    const { phoneNumber, email, firstName, lastName, profilePicture } = req.body;
    
    // Check if verification was completed by checking if the code was used
    // In a real implementation, you'd track verified sessions/tokens
    // For demo purposes, we'll trust that the client is proceeding correctly
    // after successful verification
    
    // Check if user already exists
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      // If user already exists, return existing user
      // Generate token
      const token = generateToken({ id: existingUser.id, type: 'user' });
      
      return res.status(200).json({
        message: 'User already exists, logged in successfully',
        token,
        user: {
          id: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          phoneNumber: existingUser.phoneNumber
        }
      });
    }
    
    // Create user with a temporary password
    const tempPassword = await hashPassword(Math.random().toString(36).slice(-8)); // Random temp password
    
    const user = await User.create({
      firstName: firstName || 'User',
      lastName: lastName || '',
      email: email || null,
      password: tempPassword,
      phoneNumber: phoneNumber,
      profilePicture: profilePicture || null
    });
    
    // Generate token
    const token = generateToken({ id: user.id, type: 'user' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during profile creation' });
  }
});


module.exports = router;
