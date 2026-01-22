const { RideType } = require('../models');

const rideTypes = [
  {
    name: 'uberx',
    displayName: 'UberX',
    description: 'Affordable, everyday rides',
    baseFare: 2.50,
    perMileRate: 1.50,
    perMinuteRate: 0.25,
    minimumFare: 5.00,
    capacity: 4,
    icon: 'car',
    isActive: true
  },
  {
    name: 'uberxl',
    displayName: 'UberXL',
    description: 'Larger vehicles for up to 6 passengers',
    baseFare: 3.50,
    perMileRate: 2.00,
    perMinuteRate: 0.30,
    minimumFare: 7.00,
    capacity: 6,
    icon: 'suv',
    isActive: true
  },
  {
    name: 'uber_black',
    displayName: 'Uber Black',
    description: 'Premium rides in luxury vehicles',
    baseFare: 8.00,
    perMileRate: 3.50,
    perMinuteRate: 0.50,
    minimumFare: 15.00,
    capacity: 4,
    icon: 'luxury',
    isActive: true
  },
  {
    name: 'uber_comfort',
    displayName: 'Uber Comfort',
    description: 'Newer cars with extra legroom',
    baseFare: 4.00,
    perMileRate: 2.25,
    perMinuteRate: 0.35,
    minimumFare: 8.00,
    capacity: 4,
    icon: 'comfort',
    isActive: true
  }
];

async function seedRideTypes() {
  try {
    console.log('Seeding ride types...');
    
    for (const rideTypeData of rideTypes) {
      const [rideType, created] = await RideType.findOrCreate({
        where: { name: rideTypeData.name },
        defaults: rideTypeData
      });
      
      if (created) {
        console.log(`Created ride type: ${rideType.displayName}`);
      } else {
        console.log(`Ride type already exists: ${rideType.displayName}`);
      }
    }
    
    console.log('Ride types seeded successfully!');
  } catch (error) {
    console.error('Error seeding ride types:', error);
  }
}

module.exports = seedRideTypes;

// Run if called directly
if (require.main === module) {
  const sequelize = require('../config/database');
  sequelize.sync().then(() => {
    seedRideTypes().then(() => {
      process.exit(0);
    });
  });
}

