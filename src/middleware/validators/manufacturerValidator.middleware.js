const { body } = require('express-validator');

exports.createManufacturerSchema = [
    body('ManufacturerName')
        .exists()
        .withMessage('ManufacturerName is required')
        .isLength({
            min: 3,
        })
        .withMessage('ManufacturerName must be at least 3 chars long'),
]

exports.updateManufacturerSchema = [
    body('ManufacturerName')
        .exists()
        .withMessage('ManufacturerName is required')
        .isLength({
            min: 3,
        })
        .withMessage('ManufacturerName must be at least 3 chars long'),
]