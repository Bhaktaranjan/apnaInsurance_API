const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const logger = require('../middleware/logger');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res, next) => {
    try {
        // Get the list of Users
        const userList = await UserModel.findAllUserQuery();

        // Log success message
        logger.success('Users fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Users fetched successfully!',
            users: userList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Users.' });
    }


}

/**
 * Retrieves a user by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getUserById = async (req, res, next) => {
    // Log the request parameters
    logger.info('Message : GetById User Params :', req.params);

    // Check if the ID parameter is missing or empty
    if (!req.params.id || req.params.id === ':id') {
        res.status(400).send({ message: 'User ID cannot be empty!' });
        return;
    }

    // Find the user by ID
    const user = await UserModel.findOneUserQuery({ id: req.params.id });

    // Check if the user exists
    if (!user) {
        // Log the error and send a 404 response
        logger.error('Message : User not found!');
        res.status(404).send({
            status: 404,
            message: "User not found!",
        });
    } else {
        // Exclude the password field from the user object
        const { Password, ...userWithoutPassword } = user;
        // Log the success message and send a 200 response with the user data
        logger.success('User fetched successfully!');
        res.status(200).send({
            status: 200,
            message: "User fetched successfully!",
            user: userWithoutPassword,
        });
    }
};

/**
 * Create a new user
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.createUser = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Create User request', req.body);

        // Validate the user request
        userCheckValidation(req);

        // Hash the user password
        await hashPassword(req);

        // Create the user in the database
        const result = await UserModel.createUserQuery(req.body);

        // Check if user creation was successful
        if (!result) {
            logger.error('Unable to create user!');
            throw new HttpException(500, 'Unable to create user!');
        }

        // Log success message
        logger.success('User created successfully!');

        // Send response to client
        res.status(200).send({
            status: 200,
            message: 'User created successfully!',
        });
    } catch (err) {
        // Log and handle errors
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all users.' });
    }
};

/**
 * Sign in a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.signinUser = async (req, res, next) => {
    try {
        // Log the sign-in request
        logger.info('Message: SignIn request', req.body);

        // Extract the username and password from the request body
        const UserName = req.body.userName;
        const Pass = req.body.password;

        // Find the user in the database
        const user = await UserModel.findOneUserQuery({ UserName });

        // If user is not found, send an error response
        if (!user) {
            logger.error('Unable to find user!');
            return res.status(401).send({
                status: 401,
                message: 'Unable to find user!'
            });
        }

        // Check if the password matches the stored password
        const isMatch = await bcrypt.compare(Pass, user.Password);

        console.log('isPassword Match', isMatch);

        if (!isMatch) {
            // If password does not match, send an error response
            return res.status(401).send({
                status: 401,
                message: 'Incorrect password!'
            });
        } else {
            // Generate a JWT token
            const secretKey = process.env.SECRET_JWT || '';
            logger.info('Get secretKey from env :', secretKey);

            const token = jwt.sign({ id: user.Id.toString() }, secretKey, {
                expiresIn: '24h',
            });
            logger.info('Create Token using secretKey :', token);

            // Remove the password from the user object before sending the response
            const { Password, ...userWithoutPassword } = user;
            return res.status(200).send({
                status: 200,
                message: 'Admin authentication successful!',
                token: token,
                userData: userWithoutPassword,
            });
        }
    } catch (err) {
        // Handle any errors that occur during sign-in
        next(err);
    }
};

/**
 * Updates the password for a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.updatePassword = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Update Password for user request', req.body);

        // Check if the user id is provided
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'User Id can not be empty!' });
            return;
        }

        // Validate the request body
        userCheckValidation(req);

        // Hash the password
        await hashPassword(req);

        // Separate the Confirm_Password field and the rest of the updates
        const { Confirm_Password, ...restOfUpdates } = req.body;

        // Update the password in the database
        const result = await UserModel.updatePasswordQuery(restOfUpdates, req.params.id);

        // Check if the update was successful
        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        // Log the success message
        logger.success(`Message : Password Successfully Updated`);

        const { affectedRows, changedRows, info } = result;

        // Generate the appropriate message based on the update result
        const message = !affectedRows
            ? 'User not found'
            : affectedRows && changedRows
                ? 'Password updated successfully'
                : 'Update failed';

        // Send the response
        res.status(200).send({
            status: 200,
            message: message,
            info: info
        });

    } catch (err) {
        // Log the error message
        logger.error(err.message);

        // Send the error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating password.' });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Update User request', req.body);

        // Check if the user id is provided
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'User Id can not be empty!' });
            return;
        }

        // Validate the request body
        userCheckValidation(req);

        // Update the user in the database
        const result = await UserModel.updateUserQuery(req.body, req.params.id);

        // Check if the update was successful
        if (!result) {
            throw new HttpException(404, 'Unable to update User!');
        }

        // Log the success message
        logger.success(`Message : User Successfully Updated!`);

        const { affectedRows, changedRows, info } = result;

        // Generate the appropriate message based on the update result
        const message = !affectedRows
            ? 'User not found!'
            : affectedRows && changedRows
                ? 'User updated successfully!'
                : 'Update failed!';

        // Send the response
        res.status(200).send({
            status: 200,
            message: message,
            info: info
        })
    } catch (err) {
        // Log the error message
        logger.error(err.message);

        // Send the error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating user!' });
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Delete User request', req.body);

        // Check if the user id is provided
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'User Id can not be empty!' });
            return;
        }

        // Delete the user from the database
        const result = await UserModel.deleteUserQuery(req.params.id);

        // Check if the user was deleted successfully
        if (result && result.affectedRows === 0) {
            throw new HttpException(404, 'Unable to delete User!');
        }

        // Log the success message
        logger.success('User deleted successfully!');

        // Send the success response
        res.status(200).send({
            status: 200,
            message: 'User deleted successfully!',
        })
    } catch (err) {
        // Log the error message
        logger.error(err.message);

        // Send the error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting user.' });
    }
}

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