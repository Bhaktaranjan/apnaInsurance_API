const { body } = require('express-validator');

exports.createManufacturerSchema = [
    body('Name')
        .exists()
        .withMessage('Name is required')
        .isLength({
            min: 3,
        })
        .withMessage('Name must be at least 3 chars long'),
]

exports.updateManufacturerSchema = [
    body('Name')
        .exists()
        .withMessage('Name is required')
        .isLength({
            min: 3,
        })
        .withMessage('Name must be at least 3 chars long'),
]