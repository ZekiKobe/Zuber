const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RideType = sequelize.define('RideType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  baseFare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 2.50
  },
  perMileRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.50
  },
  perMinuteRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.25
  },
  minimumFare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5.00
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'ride_types'
});

module.exports = RideType;

