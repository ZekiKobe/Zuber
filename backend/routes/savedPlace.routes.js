const express = require('express');
const router = express.Router();
const { SavedPlace } = require('../models');
const { authenticateUser } = require('../middleware/auth.middleware');

// Get all saved places for user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const places = await SavedPlace.findAll({
      where: { userId: req.user.id },
      order: [
        ['placeType', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create saved place
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, address, latitude, longitude, placeType } = req.body;
    
    const place = await SavedPlace.create({
      userId: req.user.id,
      name,
      address,
      latitude,
      longitude,
      placeType: placeType || 'favorite'
    });
    
    res.status(201).json({
      message: 'Place saved successfully',
      place
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update saved place
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const place = await SavedPlace.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    const { name, address, latitude, longitude, placeType } = req.body;
    
    place.name = name || place.name;
    place.address = address || place.address;
    place.latitude = latitude || place.latitude;
    place.longitude = longitude || place.longitude;
    place.placeType = placeType || place.placeType;
    
    await place.save();
    
    res.json({
      message: 'Place updated successfully',
      place
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete saved place
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const place = await SavedPlace.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    await place.destroy();
    
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

