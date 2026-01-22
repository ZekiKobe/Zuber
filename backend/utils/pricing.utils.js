/**
 * Calculate ride fare based on distance, duration, and ride type
 */
function calculateFare(distance, duration, rideType, surgeMultiplier = 1.0) {
  const baseFare = parseFloat(rideType.baseFare) || 2.50;
  const perMileRate = parseFloat(rideType.perMileRate) || 1.50;
  const perMinuteRate = parseFloat(rideType.perMinuteRate) || 0.25;
  const minimumFare = parseFloat(rideType.minimumFare) || 5.00;
  
  // Calculate fare
  const distanceFare = distance * perMileRate;
  const timeFare = (duration / 60) * perMinuteRate; // duration in seconds, convert to minutes
  const subtotal = baseFare + distanceFare + timeFare;
  
  // Apply surge pricing
  const totalFare = subtotal * surgeMultiplier;
  
  // Ensure minimum fare
  return Math.max(totalFare, minimumFare);
}

/**
 * Calculate surge multiplier based on demand
 */
function calculateSurgeMultiplier(activeRideRequests, availableDrivers) {
  if (availableDrivers === 0) {
    return 2.0; // Maximum surge if no drivers available
  }
  
  const demandRatio = activeRideRequests / availableDrivers;
  
  if (demandRatio >= 3.0) {
    return 2.0; // 2x surge
  } else if (demandRatio >= 2.0) {
    return 1.75; // 1.75x surge
  } else if (demandRatio >= 1.5) {
    return 1.5; // 1.5x surge
  } else if (demandRatio >= 1.2) {
    return 1.25; // 1.25x surge
  }
  
  return 1.0; // No surge
}

/**
 * Calculate estimated time of arrival (ETA) in seconds
 */
function calculateETA(distance, averageSpeed = 30) {
  // distance in miles, averageSpeed in mph
  const hours = distance / averageSpeed;
  return Math.round(hours * 3600); // Convert to seconds
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = {
  calculateFare,
  calculateSurgeMultiplier,
  calculateETA,
  calculateDistance
};

