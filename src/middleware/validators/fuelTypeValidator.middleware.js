const { body } = require('express-validator');

exports.createFuelTypeSchema = [
    body('FuelType')
        .exists()
        .withMessage('FuelType is required')
        .isLength({
            min: 3,
        })
        .withMessage('FuelType must be at least 3 chars long'),
];

exports.updateFuelTypeSchema = [
    body('FuelType')
        .exists()
        .withMessage('FuelType is required')
        .isLength({
            min: 3,
        })
        .withMessage('FuelType must be at least 3 chars long'),
];
