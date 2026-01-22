const express = require('express');
const router = express.Router();
const { RideType } = require('../models');

// Get all active ride types
router.get('/', async (req, res) => {
  try {
    const rideTypes = await RideType.findAll({
      where: { isActive: true },
      order: [['baseFare', 'ASC']]
    });
    
    res.json(rideTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ride type
router.get('/:id', async (req, res) => {
  try {
    const rideType = await RideType.findByPk(req.params.id);
    
    if (!rideType) {
      return res.status(404).json({ message: 'Ride type not found' });
    }
    
    res.json(rideType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

