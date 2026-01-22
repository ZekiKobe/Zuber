const express = require('express');
const router = express.Router();
const { User, Ride, Payment } = require('../models');
const { authenticateUser } = require('../middleware/auth.middleware');

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, latitude, longitude } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.latitude = latitude || user.latitude;
    user.longitude = longitude || user.longitude;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        latitude: user.latitude,
        longitude: user.longitude
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user ride history
router.get('/rides', authenticateUser, async (req, res) => {
  try {
    const rides = await Ride.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Payment,
        attributes: ['amount', 'currency', 'paymentStatus']
      }]
    });
    
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific ride details
router.get('/rides/:id', authenticateUser, async (req, res) => {
  try {
    const ride = await Ride.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Payment,
        attributes: ['amount', 'currency', 'paymentStatus']
      }]
    });
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    res.json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;