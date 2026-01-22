const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedPlace = sequelize.define('SavedPlace', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  placeType: {
    type: DataTypes.ENUM('home', 'work', 'favorite', 'recent'),
    allowNull: false,
    defaultValue: 'favorite'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'saved_places'
});

module.exports = SavedPlace;

