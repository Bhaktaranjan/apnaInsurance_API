const StatusModel = require('../models/status.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');


/**
 * Get all status.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getAllStatus = async (req, res, next) => {
    try {
        // Fetch all status from the database
        const statusList = await StatusModel.getAllStatusQuery();

        // Log success message
        logger.success('Status fetched successfully!');

        // Send response with status list
        res.status(200).send({
            status: 200,
            message: 'Status fetched successfully!',
            statusList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all status.' });
    }
}

/**
 * Retrieves all status by parent type ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getAllstatusByParentTypeId = async (req, res, next) => {
    try {
        // Check if the ID is provided
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Status Id cannot be empty!');
            res.status(400).send({ message: 'Status Id can not be empty!' });
            return;
        }

        // Retrieve the status list
        const statusList = await StatusModel.getAllStatusByParentTypeIdQuery(req.params.id);

        // Log success message
        logger.success('Status fetched successfully!');

        // Send response with the status list
        res.status(200).send({
            status: 200,
            message: 'Status fetched successfully!',
            statusList: statusList,
        });
    } catch (error) {
        // Log error message
        logger.error(error.message);

        // Send error response
        res.status(500).send({ message: error.message || 'Some error occurred while fetching all status.' });
    }
}

// Create a new status
/**
 * Create a new status.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.createStatus = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message : Create status Params :', req.body);

        // Validate the status check
        statusCheckValidation(req);

        // Check if the status already exists
        const status = await StatusModel.getAllStatusByNameQuery(req.body.Status);

        if (status) {
            // If the status already exists, send a conflict response
            logger.error('status already exists!');
            res.status(409).send({
                status: 409,
                message: 'status already exists!'
            });
            return;
        } else {
            // Create the status
            const result = await StatusModel.createStatusQuery(req.body);

            // If creation fails, throw an error
            if (!result) {
                logger.error('Unable to create status!');
                throw new HttpException(500, 'Unable to create status!');
            }

            // Log success message
            logger.success('status created successfully!');

            // Send success response
            res.status(200).send({
                status: 200,
                message: 'status created successfully!',
            });
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);
        console.log('Catch block called.......');

        // Send error response
        res.status(500).send({
            message: err.message || 'Some error occurred while creating status.'
        });
    }
}

/**
 * Update the status with the given ID.
 * 
 * @param {object} req - The incoming request object.
 * @param {object} res - The outgoing response object.
 * @param {function} next - The next middleware function.
 */
exports.updateStatus = async (req, res, next) => {
    try {
        // Log the request body and params
        logger.info('Message : Update Status Request :', req.body);
        logger.info('Message : Update Status Params :', req.params);

        // Check if the ID parameter is empty
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Status Id cannot be empty!');
            res.status(400).send({ message: 'Status Id can not be empty!' });
            return;
        }

        // Validate the status check request
        statusCheckValidation(req);

        // Get the existing status by ID
        const data = await StatusModel.getAllStatusByIdQuery(req.params.id);

        if (data) {
            // Check if the status with the given name already exists
            const status = await StatusModel.getAllStatusByNameQuery(req.body)

            if (status && status.Id != req.params.id) {
                logger.error('status already exists!');
                res.status(409).send({ status: 409, message: ' Status already exists!' });
                return;

            } else {
                // Update the status
                const result = await StatusModel.updateStatusQuery(req.body, req.params.id);

                if (result && result.affectedRows === 0) {
                    logger.error('Unable to update Status!');
                    throw new HttpException(500, 'Unable to update Status!');
                }

                logger.success('Status updated successfully!');

                return res.status(200).send({
                    status: 200,
                    message: 'Status updated successfully!',
                });
            }
        } else {
            logger.error('Status Id not found!');
            res.status(400).send({ message: 'Status Id not found!' });
            return;
        }

    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating Status.' });
    }
}

/**
 * Deletes a status.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.deleteStatus = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Delete Status Params :', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Status Id cannot be empty!');
            res.status(400).send({ message: 'Status Id can not be empty!' });
            return;
        }

        const result = await StatusModel.deleteStatusQuery(req.params.id);

        // If deletion fails, throw an error
        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete Status!');
            throw new HttpException(500, 'Unable to delete Status!');
        }

        // Log success message
        logger.success('Status deleted successfully!');

        // Send success response
        res.status(200).send({
            status: 200,
            message: 'Status deleted successfully!',
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Status.' });
    }
}

const statusCheckValidation = (req) => {
    // Validate the request using the validationResult function
    const errors = validationResult(req);

    // If there are validation errors
    if (!errors.isEmpty()) {
        // Throw an HttpException with the first error message
        logger.error('Validation Failed!', errors.errors[0].msg);
        const firstErrorMessage = errors.errors[0].msg;
        throw new HttpException(400, firstErrorMessage, firstErrorMessage);
    }
};