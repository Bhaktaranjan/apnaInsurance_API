const { body } = require('express-validator');

exports.createVariantSchema = [
    body('VariantName')
        .exists()
        .withMessage('VariantName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VariantName must be at least 1 chars long'),
]
exports.updateVariantSchema = [
    body('VariantName')
        .exists()
        .withMessage('VariantName is required')
        .isLength({
            min: 1,
        })
        .withMessage('VariantName must be at least 1 chars long'),
]