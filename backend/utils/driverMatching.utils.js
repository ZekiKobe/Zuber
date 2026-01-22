const { Driver, Vehicle } = require('../models');
const { calculateDistance } = require('./pricing.utils');
const { Op } = require('sequelize');

/**
 * Find the best available driver for a ride request
 */
async function findBestDriver(pickupLat, pickupLon, rideTypeId, maxDistance = 10) {
  try {
    // Find all available drivers
    const drivers = await Driver.findAll({
      where: {
        isAvailable: true,
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null }
      },
      include: [{
        model: Vehicle,
        required: false
      }]
    });
    
    if (drivers.length === 0) {
      return null;
    }
    
    // Calculate distance for each driver and find the closest
    let bestDriver = null;
    let minDistance = Infinity;
    
    for (const driver of drivers) {
      if (driver.latitude && driver.longitude) {
        const distance = calculateDistance(
          parseFloat(pickupLat),
          parseFloat(pickupLon),
          parseFloat(driver.latitude),
          parseFloat(driver.longitude)
        );
        
        // Check if driver is within max distance and has better rating
        if (distance <= maxDistance && distance < minDistance) {
          // Consider rating as tiebreaker (prefer higher rated drivers)
          if (!bestDriver || 
              (distance === minDistance && driver.rating > bestDriver.rating) ||
              distance < minDistance) {
            bestDriver = driver;
            minDistance = distance;
          }
        }
      }
    }
    
    return bestDriver ? {
      driver: bestDriver,
      distance: minDistance
    } : null;
  } catch (error) {
    console.error('Error finding best driver:', error);
    return null;
  }
}

/**
 * Find multiple nearby drivers (for showing on map)
 */
async function findNearbyDrivers(lat, lon, maxDistance = 5, limit = 10) {
  try {
    const drivers = await Driver.findAll({
      where: {
        isAvailable: true,
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null }
      },
      limit: limit
    });
    
    const nearbyDrivers = [];
    
    for (const driver of drivers) {
      if (driver.latitude && driver.longitude) {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lon),
          parseFloat(driver.latitude),
          parseFloat(driver.longitude)
        );
        
        if (distance <= maxDistance) {
          nearbyDrivers.push({
            driver,
            distance
          });
        }
      }
    }
    
    // Sort by distance
    nearbyDrivers.sort((a, b) => a.distance - b.distance);
    
    return nearbyDrivers;
  } catch (error) {
    console.error('Error finding nearby drivers:', error);
    return [];
  }
}

module.exports = {
  findBestDriver,
  findNearbyDrivers
};

