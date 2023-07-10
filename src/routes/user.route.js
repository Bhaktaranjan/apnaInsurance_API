const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const {
    createUserSchema, validateLoginSchema, validatePasswordSchema,
} = require('../middleware/validators/userValidator.middleware');
const authAdmin = require('../middleware/adminAuth.middleware');
router.get('/user/:id', userController.getUserById);
router.post('/user', createUserSchema, userController.createUser);
router.post('/signin', validateLoginSchema, userController.signinUser);
router.post('/update-password/:id', authAdmin(), validatePasswordSchema, userController.updatePassword);
module.exports = router;
