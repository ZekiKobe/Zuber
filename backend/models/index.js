const sequelize = require('../config/database');
const User = require('./user.model');
const Driver = require('./driver.model');
const Ride = require('./ride.model');
const Vehicle = require('./vehicle.model');
const Payment = require('./payment.model');
const RideType = require('./rideType.model');
const Rating = require('./rating.model');
const PromoCode = require('./promoCode.model');
const SavedPlace = require('./savedPlace.model');
const PaymentMethod = require('./paymentMethod.model');
const Notification = require('./notification.model');

// Define relationships
User.hasMany(Ride, { foreignKey: 'userId' });
Ride.belongsTo(User, { foreignKey: 'userId' });

Driver.hasMany(Ride, { foreignKey: 'driverId' });
Ride.belongsTo(Driver, { foreignKey: 'driverId' });

Driver.hasOne(Vehicle, { foreignKey: 'driverId' });
Vehicle.belongsTo(Driver, { foreignKey: 'driverId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

RideType.hasMany(Ride, { foreignKey: 'rideTypeId' });
Ride.belongsTo(RideType, { foreignKey: 'rideTypeId' });

Ride.hasOne(Rating, { foreignKey: 'rideId' });
Rating.belongsTo(Ride, { foreignKey: 'rideId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Driver.hasMany(Rating, { foreignKey: 'driverId' });
Rating.belongsTo(Driver, { foreignKey: 'driverId' });

User.hasMany(SavedPlace, { foreignKey: 'userId' });
SavedPlace.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(PaymentMethod, { foreignKey: 'userId' });
PaymentMethod.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Driver.hasMany(Notification, { foreignKey: 'driverId' });
Notification.belongsTo(Driver, { foreignKey: 'driverId' });

module.exports = {
  sequelize,
  User,
  Driver,
  Ride,
  Vehicle,
  Payment,
  RideType,
  Rating,
  PromoCode,
  SavedPlace,
  PaymentMethod,
  Notification
};