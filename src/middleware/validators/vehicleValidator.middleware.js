const { body } = require('express-validator');

exports.createVehicleSchema = [
    body('VehicleName')
        .exists()
        .withMessage('VehicleName is required')
        .isLength({
            min: 3,
        })
        .withMessage('VehicleName must be at least 3 chars long'),
]

exports.updateVehicleSchema = [
    body('VehicleName')
        .exists()
        .withMessage('VehicleName is required')
        .isLength({
            min: 3,
        })
        .withMessage('VehicleName must be at least 3 chars long'),
]