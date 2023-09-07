const { body } = require('express-validator');

exports.createVehicleSchema = [
    body('VehicleModelName')
        .exists()
        .withMessage('VehicleModelName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VehicleModelName must be at least 1 chars long'),
]

exports.updateVehicleSchema = [
    body('VehicleModelName')
        .exists()
        .withMessage('VehicleModelName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VehicleModelName must be at least 1 chars long'),
]