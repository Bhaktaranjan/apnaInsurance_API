const HttpException = require('../utils/HttpException.utils');
const AdminModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const logger = require('./logger');
dotenv.config();

/**
 * Middleware function to authenticate admin users.
 * @returns {Function} The middleware function.
 */
const authAdmin = () => {
    return async function (req, res, next) {
        // Get the secret key from environment variables
        const secretKey = process.env.SECRET_JWT || '';

        // Log the secret key
        logger.info('secretKey:', secretKey);

        // Get the token from the request headers
        const token = req.headers["x-access-token"];

        // Return error response if no token is provided
        if (!token) return res.status(403).send({ message: "No token provided!" });

        // Verify the token using the secret key
        jwt.verify(token, secretKey, (err, decoded) => {
            // Return error response if token verification fails
            if (err) return res.status(401).send({ status: 401, message: "Unauthorized!" });

            // Set the user ID from the decoded token
            req.userId = decoded.id;

            // Call the next middleware function
            next();
        });
    };
};

module.exports = authAdmin;