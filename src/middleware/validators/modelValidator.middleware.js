const { body } = require('express-validator');

exports.createModelSchema = [
    body('ModelName')
        .exists()
        .withMessage('ModelName is required')
        .isLength({
            min: 1,
        })
        .withMessage('ModelName must be at least 1 chars long'),
]
exports.updateModelSchema = [
    body('ModelName')
        .exists()
        .withMessage('ModelName is required')
        .isLength({
            min: 1,
        })
        .withMessage('ModelName must be at least 1 chars long'),
]