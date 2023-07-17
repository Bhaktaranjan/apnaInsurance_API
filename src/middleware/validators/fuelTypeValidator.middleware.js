const { body } = require('express-validator');

exports.createFuelTypeSchema = [
    body('FuelType')
        .exists()
        .withMessage('FuelType is required')
        .isLength({
            min: 1,
        })
        .withMessage('FuelType must be at least 1 chars long'),
];

exports.updateFuelTypeSchema = [
    body('FuelType')
        .exists()
        .withMessage('FuelType is required')
        .isLength({
            min: 1,
        })
        .withMessage('FuelType must be at least 1 chars long'),
];
