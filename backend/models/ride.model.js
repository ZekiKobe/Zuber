const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ride = sequelize.define('Ride', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pickupLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  pickupLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  destinationLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  destinationLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  pickupAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destinationAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distance: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  rideTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  surgeMultiplier: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.00
  },
  promoCodeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  estimatedFare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estimatedDistance: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isScheduled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentMethodId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('requested', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'requested'
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.ENUM('user', 'driver', 'system'),
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'rides'
});

module.exports = Ride;