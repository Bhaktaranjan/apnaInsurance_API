const { body } = require('express-validator');

exports.createModelSchema = [
    body('VariantName')
        .exists()
        .withMessage('VariantName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VariantName must be at least 1 chars long'),
]
exports.updateModelSchema = [
    body('VariantName')
        .exists()
        .withMessage('VariantName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VariantName must be at least 1 chars long'),
]