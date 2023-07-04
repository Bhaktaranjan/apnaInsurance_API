const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const {
    createUserSchema, validateLogin,
} = require('../middleware/validators/userValidator.middleware');
router.get('/user/:id', userController.getUserById);
router.post('/user', createUserSchema, userController.createUser);
router.post('/signin', validateLogin, userController.signinUser);
module.exports = router;
