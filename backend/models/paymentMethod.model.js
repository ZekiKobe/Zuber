const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'cash'),
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastFour: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiryMonth: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  expiryYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cardholderName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'payment_methods'
});

module.exports = PaymentMethod;

