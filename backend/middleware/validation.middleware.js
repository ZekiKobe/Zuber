const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateRideRequest = [
  body('pickupLatitude').isFloat().withMessage('Valid pickup latitude is required'),
  body('pickupLongitude').isFloat().withMessage('Valid pickup longitude is required'),
  body('destinationLatitude').isFloat().withMessage('Valid destination latitude is required'),
  body('destinationLongitude').isFloat().withMessage('Valid destination longitude is required'),
  body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
  body('destinationAddress').notEmpty().withMessage('Destination address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateRideRequest
};