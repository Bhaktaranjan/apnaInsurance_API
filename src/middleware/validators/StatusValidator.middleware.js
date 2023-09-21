const { body } = require('express-validator');

exports.createStatusSchema = [
    body('Status')
        .exists()
        .withMessage('Status is required')
        .isLength({
            min: 1,
        })
        .withMessage('Status must be at least 1 chars long'),
    body('ParentTypeStatus')
        .exists()
        .withMessage('ParentTypeStatus is required'),    
];

exports.updateStatusSchema = [
    body('Status')
        .exists()
        .withMessage('Status is required')
        .isLength({
            min: 1,
        })
        .withMessage('Status must be at least 1 chars long'),
    body('ParentTypeStatus')
        .exists()
        .withMessage('ParentTypeStatus is required'),      
];
