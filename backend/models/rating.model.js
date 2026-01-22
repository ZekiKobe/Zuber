const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rideId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  driverRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  userReview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  driverReview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ratedBy: {
    type: DataTypes.ENUM('user', 'driver'),
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'ratings'
});

module.exports = Rating;

