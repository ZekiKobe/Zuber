/**
 * Distance calculation utilities using Haversine formula
 * Compatible with MySQL (no PostGIS required)
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * MySQL-compatible distance calculation for use in raw queries
 * Returns SQL expression for calculating distance in kilometers
 */
export function getDistanceSQL(
  latColumn: string,
  lonColumn: string,
  lat: number,
  lon: number,
): string {
  return `(
    6371 * acos(
      cos(radians(${lat})) *
      cos(radians(${latColumn})) *
      cos(radians(${lonColumn}) - radians(${lon})) +
      sin(radians(${lat})) *
      sin(radians(${latColumn}))
    )
  )`;
}

