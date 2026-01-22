const express = require('express');
const router = express.Router();
const { PaymentMethod } = require('../models');
const { authenticateUser } = require('../middleware/auth.middleware');

// Get all payment methods for user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const methods = await PaymentMethod.findAll({
      where: { userId: req.user.id, isActive: true },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });
    
    res.json(methods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add payment method
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { type, provider, lastFour, expiryMonth, expiryYear, cardholderName, token, isDefault } = req.body;
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await PaymentMethod.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      );
    }
    
    const method = await PaymentMethod.create({
      userId: req.user.id,
      type,
      provider,
      lastFour,
      expiryMonth,
      expiryYear,
      cardholderName,
      token,
      isDefault: isDefault || false
    });
    
    res.status(201).json({
      message: 'Payment method added successfully',
      method
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment method
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const method = await PaymentMethod.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    const { isDefault } = req.body;
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await PaymentMethod.update(
        { isDefault: false },
        { where: { userId: req.user.id, id: { [require('sequelize').Op.ne]: req.params.id } } }
      );
    }
    
    method.isDefault = isDefault !== undefined ? isDefault : method.isDefault;
    await method.save();
    
    res.json({
      message: 'Payment method updated successfully',
      method
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete payment method
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const method = await PaymentMethod.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    method.isActive = false;
    await method.save();
    
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

