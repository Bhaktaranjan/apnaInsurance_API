const VehicleModelModel = require('../models/vehicleModel.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

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

exports.createVehicleModel = async (req, res, next) => {
    try {
        logger.info('Message: Create Vehicle Model request', req.body);
        vehicleModelCheckValidation(req);

        // Get the vehicle model
        const vehicleModel = await VehicleModelModel.getAllVehicleModelsQuery(req.body);

        if (vehicleModel && vehicleModel.length > 0) {
            logger.error('Vehicle Model already exists!');

            res.status(400).send({ status: 400, message: 'Vehicle Model already exists!' });
            return;
        } else {
            const result = await VehicleModelModel.createVehicleModelQuery(req.body);

            if (!result) {
                logger.error('Unable to create vehicle model!');
                throw new HttpException(500, 'Unable to create vehicle model!');
            } else {
                // Log success message
                logger.success('Vehicle Model created successfully!');
                // Send response
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

exports.updateVehicleModel = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Update Vehicle Model request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Vehicle Model Id can not be empty!' });
            return;
        }
        vehicleModelCheckValidation(req);
        // Check if the manufacturer already exists
        const vehicleModel = await VehicleModelModel.getAllVehicleModelsQuery(req.body);

        if (vehicleModel && vehicleModel.length > 0) {
            logger.error('Vehicle Model already exists!');
            res.status(400).send({ status: 400, message: 'Vehicle Model already exists!' });
            return;
        } else {
            // Get the vehicle model
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

exports.deleteVehicleModel = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Delete Vehicle Model request', req.body);
        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Vehicle Model Id can not be empty!' });
            return;
        }
        const result = await VehicleModelModel.deleteVehicleModelQuery(req.params.id);

        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete vehicle model!');
            throw new HttpException(500, 'Unable to delete vehicle model!');
        }

        logger.success('Vehicle Model deleted successfully!');

        res.status(200).send({
            status: 200,
            message: 'Vehicle Model deleted successfully!',
        })
    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting vehicle model.' });
    }
}

vehicleModelCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};