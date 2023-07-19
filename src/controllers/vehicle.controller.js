const VehicleModel = require('../models/vehicle.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

/**
 * Get all vehicle 
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.getAllVehicles = async (req, res, next) => {
    try {
        let offset = req.query.pagenumber * req.query.limit ? req.query.pagenumber * req.query.limit : 0;

        const params = {
            limit: req.query.limit ? req.query.limit : 10,
            offset: offset
        }
        // Get the list of Vehicle
        const vehicleList = await VehicleModel.getAllVehiclesWithManufacturerNameQuery(params);

        // Log success message
        logger.success('Vehicles fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Vehicles fetched successfully!',
            vehicles: vehicleList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Vehicles.' });
    }
}

exports.getAllVehiclesByManufacturerId = async (req, res, next) => {
    try {
        logger.info('Message: Get Vehicle Params', req.params);

        // Check if the ID is empty or invalid

        if (!req.params.manufacturerId || req.params.manufacturerId === ':manufacturerId') {
            logger.info('Manufacturer Id can not be empty!');
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }
        // Get the list of Vehicle
        const vehicleList = await VehicleModel.getAllVehiclesByManufacturerIdQuery(req.params.manufacturerId);

        // Log success message
        logger.success('Vehicle fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Vehicle fetched successfully!',
            vehicles: vehicleList,
        })
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching Vehicle by ManufacturerId.' });
    }
}

/**
 * Create a Vehicle.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.createVehicle = async (req, res, next) => {
    try {
        // Log request
        logger.info('Message: Create Vehicle request', req.body);

        // Validate request
        vehicleCheckValidation(req);

        // Get the Vehicle
        const vehicle = await VehicleModel.getAllVehiclesQuery(req.body);

        if (vehicle) {
            // Vehicle already exists
            logger.error('Vehicle already exists!');
            res.status(400).send({ status: 400, message: 'Vehicle already exists!' });
            return;
        } else {
            // Create the Vehicle
            const result = await VehicleModel.createVehicleQuery(req.body);

            if (!result) {
                // Unable to create Vehicle
                logger.error('Unable to create Vehicle!');
                throw new HttpException(500, 'Unable to create Vehicle!');
            } else {
                // Vehicle created successfully
                logger.success('Vehicle created successfully!');
                res.status(200).send({
                    status: 200,
                    message: 'Vehicle created successfully!'
                });
            }
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while creating Vehicle.' });
    }
}

/**
 * Updates a Vehicle.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.updateVehicle = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Update Vehicle request', req.body);
        logger.info('Message: Update Vehicle request Params', req.params);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Vehicle Id can not be empty!');
            res.status(400).send({ message: 'Vehicle Id can not be empty!' });
            return;
        }

        // Validate the request body
        vehicleCheckValidation(req);

        // Check if the Vehicle already exists
        const vehicle = await VehicleModel.getAllVehiclesQuery(req.body);
        console.log(vehicle);
        if (vehicle && vehicle.Id != req.params.id) {
            logger.error('Vehicle already exists!');
            res.status(400).send({ status: 400, message: 'Vehicle already exists!' });
            return;
        } else {
            // Update the Vehicle
            const result = await VehicleModel.updateVehicleQuery(req.body, req.params.id);

            if (result && result.affectedRows === 0) {
                logger.error('Unable to update Vehicle!');
                throw new HttpException(500, 'Unable to update Vehicle!');
            }

            // Log success message
            logger.success('Vehicle updated successfully!');

            // Send response
            res.status(200).send({
                status: 200,
                message: 'Vehicle updated successfully!'
            });
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating Vehicle.' });
    }
}

/**
 * Delete a Vehicle.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.deleteVehicle = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Delete Vehicle request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Vehicle Id can not be empty!');
            res.status(400).send({ message: 'Vehicle Id can not be empty!' });
            return;
        }

        // Delete the Vehicle
        const result = await VehicleModel.deleteVehicleQuery(req.params.id);

        // Check if the delete operation was successful
        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete Vehicle!');
            throw new HttpException(500, 'Unable to delete Vehicle!');
        }

        // Log success message
        logger.success('Vehicle deleted successfully!');

        // Send success response
        res.status(200).send({
            status: 200,
            message: 'Vehicle deleted successfully!',
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Vehicle.' });
    }
};

vehicleCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation Failed!', errors.errors[0].msg);
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};