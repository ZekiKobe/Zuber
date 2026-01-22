const express = require('express');
const router = express.Router();
const { Rating, Ride, User } = require('../models');
const { authenticateUser } = require('../middleware/auth.middleware');

// Submit rating (user rates driver)
router.post('/user', authenticateUser, async (req, res) => {
  try {
    const { rideId, driverRating, driverReview } = req.body;
    
    const ride = await Ride.findByPk(rideId);
    if (!ride || ride.userId !== req.user.id) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed rides' });
    }
    
    // Check if already rated
    const existingRating = await Rating.findOne({ where: { rideId, ratedBy: 'user' } });
    if (existingRating) {
      return res.status(400).json({ message: 'Ride already rated' });
    }
    
    const rating = await Rating.create({
      rideId,
      userId: req.user.id,
      driverRating,
      driverReview,
      ratedBy: 'user'
    });
    
    // In customer-only app, we don't update driver ratings as drivers are handled separately
    
    res.status(201).json({
      message: 'Rating submitted successfully',
      rating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get ratings for a ride
router.get('/ride/:rideId', async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { rideId: req.params.rideId },
      include: [
        { model: User, attributes: ['firstName', 'lastName'] }
      ]
    });
    
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

