const VehicleModelModel = require('../models/vehicleModel.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

/**
 * Get all vehicle models
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.getAllVehicleModels = async (req, res, next) => {
    try {
        // Get the list of vehicle models
        const vehicleModelList = await VehicleModelModel.getAllVehicleModelsQuery();

        // Log success message
        logger.success('Vehicle Models fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Vehicle Models fetched successfully!',
            vehicleModels: vehicleModelList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all vehicle models.' });
    }
}

exports.getAllVehicleModelsByManufacturerId = async (req, res, next) => {
    try {
        logger.info('Message: Get Vehicle Model Params', req.params);

        // Get the list of vehicle models
        const vehicleModelList = await VehicleModelModel.getAllVehicleModelsByManufacturerIdQuery(req.params.manufacurterId);

        // Log success message
        logger.success('Vehicle Models fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Vehicle Models fetched successfully!',
            vehicleModels: vehicleModelList,
        })
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all vehicle models.' });
    }
}

/**
 * Create a vehicle model.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.createVehicleModel = async (req, res, next) => {
    try {
        // Log request
        logger.info('Message: Create Vehicle Model request', req.body);

        // Validate request
        vehicleModelCheckValidation(req);

        // Get the vehicle model
        const vehicleModel = await VehicleModelModel.getAllVehicleModelsQuery(req.body);

        if (vehicleModel && vehicleModel.length > 0) {
            // Vehicle model already exists
            logger.error('Vehicle Model already exists!');
            res.status(400).send({ status: 400, message: 'Vehicle Model already exists!' });
            return;
        } else {
            // Create the vehicle model
            const result = await VehicleModelModel.createVehicleModelQuery(req.body);

            if (!result) {
                // Unable to create vehicle model
                logger.error('Unable to create vehicle model!');
                throw new HttpException(500, 'Unable to create vehicle model!');
            } else {
                // Vehicle model created successfully
                logger.success('Vehicle Model created successfully!');
                res.status(200).send({
                    status: 200,
                    message: 'Vehicle Model created successfully!'
                });
            }
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while creating vehicle model.' });
    }
}

/**
 * Updates a vehicle model.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.updateVehicleModel = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Update Vehicle Model request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Vehicle Model Id can not be empty!' });
            return;
        }

        // Validate the request body
        vehicleModelCheckValidation(req);

        // Check if the vehicle model already exists
        const vehicleModel = await VehicleModelModel.getAllVehicleModelsQuery(req.body);

        if (vehicleModel && vehicleModel.length > 0) {
            logger.error('Vehicle Model already exists!');
            res.status(400).send({ status: 400, message: 'Vehicle Model already exists!' });
            return;
        } else {
            // Update the vehicle model
            const result = await VehicleModelModel.updateVehicleModelQuery(req.body, req.params.id);

            if (result && result.affectedRows === 0) {
                logger.error('Unable to update vehicle model!');
                throw new HttpException(500, 'Unable to update vehicle model!');
            }

            // Log success message
            logger.success('Vehicle Model updated successfully!');

            // Send response
            res.status(200).send({
                status: 200,
                message: 'Vehicle Model updated successfully!'
            });
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating vehicle model.' });
    }
}

/**
 * Delete a vehicle model.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.deleteVehicleModel = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Delete Vehicle Model request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Vehicle Model Id can not be empty!' });
            return;
        }

        // Delete the vehicle model
        const result = await VehicleModelModel.deleteVehicleModelQuery(req.params.id);

        // Check if the delete operation was successful
        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete vehicle model!');
            throw new HttpException(500, 'Unable to delete vehicle model!');
        }

        // Log success message
        logger.success('Vehicle Model deleted successfully!');

        // Send success response
        res.status(200).send({
            status: 200,
            message: 'Vehicle Model deleted successfully!',
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting vehicle model.' });
    }
};

vehicleModelCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};