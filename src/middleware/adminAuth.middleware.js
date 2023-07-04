const HttpException = require('../utils/HttpException.utils');
const AdminModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const logger = require('./logger');
dotenv.config();

const authAdmin = () => {
    return async function (req, res, next) {

        const secretKey = process.env.SECRET_JWT || '';

        logger.info('secretKey : ', secretKey);
        const token = req.headers["x-access-token"];

        if (!token) return res.status(403).send({ message: "No token provided!" });

        jwt.verify(token, secretKey, (err, decoded) => {
            logger.error('Error in JWT verify', err);
            if (err) return res.status(401).send({ status: 401, message: "Unauthorized!" });
            req.userId = decoded.id;
            // logger.info('decoded', decoded);
            next();
        });
    };
};

module.exports = authAdmin;