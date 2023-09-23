const { body } = require('express-validator');

exports.createVehicleModelSchema = [
    body('VehicleModelName')
        .exists()
        .withMessage('VehicleModelName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VehicleModelName must be at least 1 chars long'),
]

exports.updateVehicleModelSchema = [
    body('VehicleModelName')
        .exists()
        .withMessage('VehicleModelName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VehicleModelName must be at least 1 chars long'),
]