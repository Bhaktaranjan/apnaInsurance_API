const { body } = require('express-validator');

exports.createVehicleSchema = [
    body('VehicleName')
        .exists()
        .withMessage('VehicleName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VehicleName must be at least 1 chars long'),
]

exports.updateVehicleSchema = [
    body('VehicleName')
        .exists()
        .withMessage('VehicleName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VehicleName must be at least 1 chars long'),
]