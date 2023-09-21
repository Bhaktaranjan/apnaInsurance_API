const StatusModel = require('../models/status.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');


// *******************all status***************************
exports.getAllStatus = async (req, res, next) => {
    try {
        // Get the list of FuelTypes
        const StatusList = await StatusModel.getAllStatusQuery();

        // Log success message
        logger.success(' Status fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Status fetched successfully!',
            status: StatusList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all status.' });
    }
}

// *******************all status by the id***************************
exports.getAllstatusById=async(req,res,next)=>{
    try {
        const StatusList = await StatusModel.getAllStatusByIdQuery(req.params.id );
        console.log(StatusList)
        logger.success(' Status fetched successfully!');

        res.status(200).send({
            status: 200,
            message: 'Status fetched successfully!',
            status: StatusList,
        });
    } catch (error) {
        // Log error message
        logger.error(error.message);

        // Send error response
        res.status(500).send({ message: error.message || 'Some error occurred while fetching all status.' });
    }
}




// *****************creat status API**********************************

exports.createStatus = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Create status Params :', req.body);

        // Find the FuelType by ID
        statusCheckValidation(req);

        // Get all existing fuel types
        const status = await StatusModel.getAllStatusByNameQuery(req.body);

        if (status) {
            logger.error('status already exists!');

            res.status(409).send({
                status: 409,
                message: 'status already exists!'
            });
            return;
        } else {
            // Create the FuelType
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

        // Send error response
        res.status(500).send({
            message: err.message || 'Some error occurred while creating status.'
        });
    }
}


// **************************** update status **************************** 

exports.updateStatus = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Update Status Params :', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Status Id cannot be empty!');
            res.status(400).send({ message: 'Status Id can not be empty!' });
            return;
        }

        // Perform validation checks on the request body
        statusCheckValidation(req);

        // Check if the FuelType already exists
        const status = await StatusModel.getAllStatusByNameQuery(req.body);
        console.log('status', status);
        if (status && status.Id != req.params.id) {
            logger.error('status already exists!');
            res.status(409).send({ status: 409, message: 'Status status exists!' });
            return;
        } else {
            // Update the FuelType
            const result = await StatusModel.updateStatusQuery(req.body, req.params.id);

            // If update fails, throw an error
            if (result && result.affectedRows === 0) {
                logger.error('Unable to update Status!');
                throw new HttpException(500, 'Unable to update Status!');
            }

            // Log success message
            logger.success('Status updated successfully!');

            // Send success response
            res.status(200).send({
                status: 200,
                message: 'Status updated successfully!',
            })
        }

    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating Status.' });
    }
}



// ******************* Delete Status ***********************
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

        // Delete the FuelType
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
        })
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