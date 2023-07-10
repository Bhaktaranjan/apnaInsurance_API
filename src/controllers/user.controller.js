const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const logger = require('../middleware/logger');
const jwt = require('jsonwebtoken');

//Function to get user by Request Id from Database

exports.getUserById = async (req, res, next) => {

    logger.info('Message : GetById User Params :', req.params);

    if (!req.params.id || req.params.id === ':id') {
        res.status(400).send({ message: 'User Id can not be empty!' });
        return;
    }
    const user = await UserModel.findOneUserQuery({ id: req.params.id });

    if (!user) {
        logger.error('Message : User not found!');
        res.status(404).send({
            status: 404,
            message: "User not found!",
        });
    } else {

        const { Password, ...userWithoutPassword } = user;
        logger.success('User fetched successfully!');

        res.status(200).send({
            status: 200,
            message: "User fetched successfully!",
            user: userWithoutPassword,
        });
    }
};

//Function to create an user in Database

exports.createUser = async (req, res, next) => {
    try {
        logger.info('Message: Create User request', req.body);
        userCheckValidation(req);

        await hashPassword(req);
        const result = await UserModel.createUserQuery(req.body);

        if (!result) {
            logger.error('Unable to create user!');
            throw new HttpException(500, 'Unable to create user!');
        }
        logger.success('User created successfully!');

        res.status(200).send({
            status: 200,
            message: 'User created successfully!',
        });
    } catch (err) {

        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all users.' });
    }
};

//Function to Validate and SignIn user with username and password

exports.signinUser = async (req, res, next) => {
    try {
        logger.info('Message: SignIn request', req.body);
        // const { UserName, Password: Pass } = req.body;
        const UserName = req.body.userName;
        const Pass = req.body.password;

        const user = await UserModel.findOneUserQuery({ UserName });
        if (!user) {
            logger.error('Unable to find user!');
            res.status(401).send({
                status: 401,
                message: 'Unable to find user!'
            });
        }
        logger.success(`Message : User Found : ${JSON.stringify(user.UserName)}`);
        const isMatch = await bcrypt.compare(Pass, user.Password);

        console.log('isPassword Match', isMatch);

        if (!isMatch) {
            res.status(401).send({
                status: 401,
                message: 'Incorrect password!'
            });
        } else {
            // user matched!
            const secretKey = process.env.SECRET_JWT || '';
            logger.info('Get secretKey from env :', secretKey);

            const token = jwt.sign({ id: user.Id.toString() }, secretKey, {
                expiresIn: '24h',
            });
            logger.info('Create Token using secretKey :', token);

            const { Password, ...userWithoutPassword } = user;
            res.status(200).send({
                status: 200,
                message: 'Admin authentication successful!',
                token: token,
                userData: user,
            });
        }
    } catch (err) {

    }
};

//Function to change password

exports.updatePassword = async (req, res, next) => {
    try {
        logger.info('Message: Update Password for user request', req.body);
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'User Id can not be empty!' });
            return;
        }
        userCheckValidation(req);

        await hashPassword(req);

        const { Confirm_Password, ...restOfUpdates } = req.body;
        const result = await UserModel.updatePasswordQuery(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        logger.success(`Message : Password Successfully Updated`);
        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows
            ? 'User not found'
            : affectedRows && changedRows
                ? 'Password updated successfully'
                : 'Update failed';

        res.status(200).send({
            status: 200,
            message: message,
            info: info
        });

    } catch (err) {

        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while updating password.' });
    }
};

//Function to validate request

userCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};

// hash password if it exists
hashPassword = async (req) => {
    if (req.body.Password) {
        req.body.Password = await bcrypt.hash(req.body.Password, 8);
    }
};