const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const {
    createUserSchema, validateLoginSchema, validatePasswordSchema, UpdateUserSchema,
} = require('../middleware/validators/userValidator.middleware');
const authAdmin = require('../middleware/adminAuth.middleware');

router.get('/user', authAdmin(), userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/user', createUserSchema, authAdmin(), userController.createUser);
router.post('/signin', validateLoginSchema, userController.signinUser);
router.post('/update-password/:id', authAdmin(), validatePasswordSchema, userController.updatePassword);
router.delete('/user/:id', authAdmin(), userController.deleteUser);
router.put('/user/:id', UpdateUserSchema, authAdmin(), userController.updateUser);
module.exports = router;
