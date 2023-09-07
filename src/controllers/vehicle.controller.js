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
exports.getAllVehicleModels = async (req, res, next) => {
    try {
        let offset = req.query.pagenumber * req.query.limit ? req.query.pagenumber * req.query.limit : 0;

        const params = {
            limit: req.query.limit ? req.query.limit : 10,
            offset: offset
        }
        // Get the list of Vehicle
        const vehicleList = await VehicleModel.getAllVehicleModelsWithManufacturerNameQuery();

        // Log success message
        logger.success('VehicleModels fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'VehicleModels fetched successfully!',
            vehicles: vehicleList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all VehicleModels.' });
    }
}

exports.getAllVehicleModelsByManufacturerId = async (req, res, next) => {
    try {
        logger.info('Message: Get Vehicle Params', req.params);

        // Check if the ID is empty or invalid

        if (!req.params.manufacturerId || req.params.manufacturerId === ':manufacturerId') {
            logger.info('Manufacturer Id can not be empty!');
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }
        // Get the list of Vehicle
        const vehicleList = await VehicleModel.getAllVehicleModelsByManufacturerIdQuery(req.params.manufacturerId);

        // Log success message
        logger.success('VehicleModel fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'VehicleModel fetched successfully!',
            vehicles: vehicleList,
        })
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching VehicleModel by ManufacturerId.' });
    }
}

/**
 * Create a Vehicle.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.createVehicleModel = async (req, res, next) => {
    try {
        // Log request
        logger.info('Message: Create VehicleModel request', req.body);

        // Validate request
        vehicleCheckValidation(req);

        // Get the Vehicle
        const vehicle = await VehicleModel.getAllVehicleModelsQuery(req.body);

        if (vehicle) {
            // Vehicle already exists
            logger.error('VehicleModel already exists!');
            res.status(409).send({ status: 409, message: 'VehicleModel already exists!' });
            return;
        } else {
            // Create the Vehicle
            const result = await VehicleModel.createVehicleModelQuery(req.body);

            if (!result) {
                // Unable to create Vehicle
                logger.error('Unable to create VehicleModel!');
                throw new HttpException(500, 'Unable to create VehicleModel!');
            } else {
                // Vehicle created successfully
                logger.success('VehicleModel created successfully!');
                res.status(200).send({
                    status: 200,
                    message: 'VehicleModel created successfully!'
                });
            }
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while creating VehicleModel.' });
    }
}

/**
 * Updates a Vehicle.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.updateVehicleModel = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Update VehicleModel request', req.body);
        logger.info('Message: Update VehicleModel request Params', req.params);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('VehicleModel Id can not be empty!');
            res.status(400).send({ message: 'VehicleModel Id can not be empty!' });
            return;
        }

        // Validate the request body
        vehicleCheckValidation(req);

        // Check if the Vehicle already exists
        const vehiclemodel = await VehicleModel.getAllVehicleModelsQuery(req.body);
        console.log(vehiclemodel);
        if (vehiclemodel && vehiclemodel.Id != req.params.id) {
            logger.error('VehicleModel already exists!');
            res.status(409).send({ status: 409, message: 'VehicleModel already exists!' });
            return;
        } else {
            // Update the Vehicle
            const result = await VehicleModel.updateVehicleModelQuery(req.body, req.params.id);

            if (result && result.affectedRows === 0) {
                logger.error('Unable to update VehicleModel!');
                throw new HttpException(500, 'Unable to update Vehicle!');
            }

            // Log success message
            logger.success('VehicleModel updated successfully!');

            // Send response
            res.status(200).send({
                status: 200,
                message: 'VehicleModel updated successfully!'
            });
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating VehicleModel.' });
    }
}

/**
 * Delete a Vehicle.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.deleteVehicleModel = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Delete VehicleModel request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('VehicleModel Id can not be empty!');
            res.status(400).send({ message: 'VehicleModel Id can not be empty!' });
            return;
        }
        const model = await VehicleModel.deleteVariantByVehicleModelId(req.params.id);

        if (!model) {
            logger.error(' VehicleModelID not found in Model!');
        } else {
            logger.success(' VehicleModelID found in Model and deleted successfully!');
        }
        // Delete the Vehicle
        const result = await VehicleModel.deleteVehicleModelQuery(req.params.id);

        // Check if the delete operation was successful
        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete VehicleModel!');
            throw new HttpException(500, 'Unable to delete VehicleModel!');
        }

        // Log success message
        logger.success('VehicleModel deleted successfully!');

        // Send success response
        res.status(200).send({
            status: 200,
            message: 'VehicleModel deleted successfully!',
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting VehicleModel.' });
    }
};

vehicleCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation Failed!', errors.errors[0].msg);
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};