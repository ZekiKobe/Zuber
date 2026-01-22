const express = require('express');
const router = express.Router();
const { PromoCode } = require('../models');
const { authenticateUser } = require('../middleware/auth.middleware');

// Validate promo code
router.post('/validate', authenticateUser, async (req, res) => {
  try {
    const { code } = req.body;
    
    const promoCode = await PromoCode.findOne({
      where: { 
        code: code.toUpperCase(),
        isActive: true
      }
    });
    
    if (!promoCode) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }
    
    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }
    
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return res.status(400).json({ message: 'Promo code has reached maximum uses' });
    }
    
    res.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        maxDiscount: promoCode.maxDiscount,
        minRideAmount: promoCode.minRideAmount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply promo code to ride
router.post('/apply', authenticateUser, async (req, res) => {
  try {
    const { code, rideAmount } = req.body;
    
    const promoCode = await PromoCode.findOne({
      where: { 
        code: code.toUpperCase(),
        isActive: true
      }
    });
    
    if (!promoCode) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }
    
    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }
    
    if (promoCode.minRideAmount && rideAmount < promoCode.minRideAmount) {
      return res.status(400).json({ 
        message: `Minimum ride amount of $${promoCode.minRideAmount} required` 
      });
    }
    
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = (rideAmount * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
        discount = promoCode.maxDiscount;
      }
    } else {
      discount = promoCode.discountValue;
    }
    
    const finalAmount = Math.max(0, rideAmount - discount);
    
    res.json({
      discount,
      finalAmount,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

