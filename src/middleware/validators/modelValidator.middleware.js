const { body } = require('express-validator');

exports.createModelSchema = [
    body('Name')
        .exists()
        .withMessage('Name is required')
        .isLength({
            min: 3,
        })
        .withMessage('Name must be at least 3 chars long'),
]
exports.updateModelSchema = [
    body('Name')
        .exists()
        .withMessage('Name is required')
        .isLength({
            min: 3,
        })
        .withMessage('Name must be at least 3 chars long'),
]