const { body } = require('express-validator');

exports.createUserSchema = [
	body('Name')
		.exists()
		.withMessage('Name is required')
		.isLength({
			min: 3,
		})
		.withMessage('Name must be at least 3 chars long'),

	body('Email')
		.optional()
		.isEmail()
		.withMessage('Must be a valid email')
		.normalizeEmail(),

	body('UserName')
		.exists()
		.withMessage('User name is required')
		.isAlphanumeric()
		.withMessage('Must be a valid user name'),

	body('Password')
		.exists()
		.withMessage('Password is required')
		.notEmpty()
		.isLength({
			min: 5,
		})
		.withMessage('Password must contain at least 5 characters')
		.isLength({
			max: 64,
		})
		.withMessage('Password can contain max 64 characters'),

	body('Confirm_Password')
		.exists()
		.custom((value, { req }) => value === req.body.Password)
		.withMessage(
			'Confirm Password field must have the same value as the Password field'
		),

	body('PhoneNo')
		.exists()
		.withMessage('Mobile number is required')
		.notEmpty()
		.isMobilePhone('any')
		.withMessage('Mobile number is not valid!'),
	body('Role')
		.optional()
		.notEmpty()
		.isLength({
			min: 3,
		})
		.withMessage('Role must be at least 3 chars long'),
];

exports.validateLoginSchema = [
	body('UserName')
		.exists()
		.withMessage('User name is required')
		.isAlphanumeric()
		.withMessage('Must be a valid user name'),
	body('Pass')
		.exists()
		.withMessage('Password is required')
		.notEmpty()
		.withMessage('Password must be filled'),
];

exports.validatePasswordSchema = [
	body('Password')
		.optional()
		// .notEmpty()
		.isLength({
			min: 5,
		})
		.withMessage('Password must contain at least 5 characters')
		.isLength({
			max: 64,
		})
		.withMessage('Password can contain max 64 characters')
		.custom((value, { req }) => !!req.body.Confirm_Password)
		.withMessage('Please confirm your password'),

	body('Confirm_Password')
		.optional()
		.custom((value, { req }) => value === req.body.Password)
		.withMessage(
			'Confirm Password field must have the same value as the Password field'
		),
];