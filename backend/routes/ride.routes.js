const express = require('express');
const router = express.Router();
const { Ride, User, Payment, RideType, PromoCode, Notification } = require('../models');
const { authenticateUser } = require('../middleware/auth.middleware');
const { validateRideRequest } = require('../middleware/validation.middleware');
const { Op } = require('sequelize');
const { calculateFare, calculateSurgeMultiplier, calculateETA, calculateDistance } = require('../utils/pricing.utils');


// Request a new ride
router.post('/request', authenticateUser, validateRideRequest, async (req, res) => {
  try {
    const { 
      pickupLatitude, 
      pickupLongitude, 
      destinationLatitude, 
      destinationLongitude,
      pickupAddress,
      destinationAddress,
      rideTypeId,
      promoCode,
      scheduledTime
    } = req.body;
    
    // Calculate distance and estimated duration
    const distance = calculateDistance(
      parseFloat(pickupLatitude),
      parseFloat(pickupLongitude),
      parseFloat(destinationLatitude),
      parseFloat(destinationLongitude)
    );
    
    const estimatedDuration = calculateETA(distance);
    
    // Get ride type (default to first available)
    let rideType = null;
    if (rideTypeId) {
      rideType = await RideType.findByPk(rideTypeId);
    }
    if (!rideType) {
      rideType = await RideType.findOne({ where: { isActive: true }, order: [['baseFare', 'ASC']] });
    }
    
    if (!rideType) {
      return res.status(400).json({ message: 'No ride types available' });
    }
    
    // Calculate surge multiplier
    const activeRequests = await Ride.count({ where: { status: 'requested' } });
    // In customer-only app, we'll use a default driver count or simulate driver availability
    const availableDrivers = 10; // Simulated available drivers for surge calculation
    const surgeMultiplier = calculateSurgeMultiplier(activeRequests, availableDrivers);
    
    // Calculate estimated fare
    const estimatedFare = calculateFare(distance, estimatedDuration, rideType, surgeMultiplier);
    
    // Apply promo code if provided
    let discountAmount = 0;
    let promoCodeId = null;
    if (promoCode) {
      const promo = await PromoCode.findOne({
        where: { code: promoCode.toUpperCase(), isActive: true }
      });
      
      if (promo) {
        const now = new Date();
        if (now >= promo.validFrom && now <= promo.validUntil) {
          if (promo.discountType === 'percentage') {
            discountAmount = (estimatedFare * promo.discountValue) / 100;
            if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
              discountAmount = promo.maxDiscount;
            }
          } else {
            discountAmount = promo.discountValue;
          }
          promoCodeId = promo.id;
        }
      }
    }
    
    const finalFare = Math.max(0, estimatedFare - discountAmount);
    
    // Check if scheduled ride
    const isScheduled = scheduledTime && new Date(scheduledTime) > new Date();
    
    // Create ride request
    const ride = await Ride.create({
      userId: req.user.id,
      pickupLatitude,
      pickupLongitude,
      destinationLatitude,
      destinationLongitude,
      pickupAddress,
      destinationAddress,
      rideTypeId: rideType.id,
      estimatedDistance: distance,
      estimatedDuration,
      estimatedFare: finalFare,
      surgeMultiplier,
      promoCodeId,
      discountAmount,
      scheduledTime: isScheduled ? scheduledTime : null,
      isScheduled,
      status: isScheduled ? 'requested' : 'requested'
    });
    
    // If not scheduled, the ride remains in 'requested' status for the customer-only app
    if (!isScheduled) {
      // In a customer-only app, we don't assign drivers automatically
      // Drivers would be handled in a separate driver app
    }
    
    // Create notification for user
    await Notification.create({
      userId: req.user.id,
      type: 'ride_request',
      title: 'Ride Requested',
      message: isScheduled ? 'Your ride has been scheduled' : 'Looking for a driver...',
      data: { rideId: ride.id }
    });
    
    res.status(201).json({
      message: isScheduled ? 'Ride scheduled successfully' : 'Ride requested successfully',
      ride: {
        id: ride.id,
        status: ride.status,
        estimatedFare: finalFare,
        estimatedDuration,
        estimatedDistance: distance,
        surgeMultiplier,
        driverId: ride.driverId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while requesting ride' });
  }
});

// Get ride details
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const ride = await Ride.findOne({
      where: { 
        id: req.params.id
      },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'phoneNumber']
        }
      ]
    });
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user is authorized to view this ride
    if (ride.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this ride' });
    }
    
    res.json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a ride (user)
router.put('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const ride = await Ride.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Can cancel if requested, accepted, or arriving
    if (!['requested', 'accepted', 'arriving'].includes(ride.status)) {
      return res.status(400).json({ message: 'Cannot cancel ride in current status' });
    }
    
    ride.status = 'cancelled';
    ride.cancellationReason = reason;
    ride.cancelledBy = 'user';
    await ride.save();
    
    // No notification to driver needed in customer-only app
    
    res.json({
      message: 'Ride cancelled successfully',
      rideId: ride.id,
      status: ride.status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get active rides for user
router.get('/active/user', authenticateUser, async (req, res) => {
  try {
    const activeRides = await Ride.findAll({
      where: {
        userId: req.user.id,
        status: {
          [Op.in]: ['requested', 'accepted', 'arriving', 'in_progress']
        }
      },
      include: [
        { model: RideType }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(activeRides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ride history for user
router.get('/history/user', authenticateUser, async (req, res) => {
  try {
    const rides = await Ride.findAll({
      where: {
        userId: req.user.id,
        status: {
          [Op.in]: ['completed', 'cancelled']
        }
      },
      include: [
        { model: RideType }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});







module.exports = router;