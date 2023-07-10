const FuelTypeModel = require('../models/fuelType.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

exports.getAllFuelTypes = async (req, res, next) => {
    try {
        // Get the list of FuelTypes
        const fuelTypeList = await FuelTypeModel.getAllFuelTypesQuery();
        // Log success message
        logger.success('Fuel Types fetched successfully!');
        // Send response
        res.status(200).send({
            status: 200,
            message: 'Fuel Types fetched successfully!',
            fuelTypes: fuelTypeList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Fuel Types.' });
    }
}

exports.createFuelType = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Create FuelType Params :', req.body);

        // Find the FuelType by ID
        fuelTypeCheckValidation(req);

        const fuelType = await FuelTypeModel.getAllFuelTypesQuery(req.body);

        if (fuelType && fuelType.length > 0) {
            logger.error('FuelType already exists!');

            res.status(400).send({ status: 400, message: 'FuelType already exists!' });
            return;
        }
        else {
            // Create the FuelType
            const result = await FuelTypeModel.createFuelTypeQuery(req.body);

            // If creation fails, throw an error
            if (!result) {
                logger.error('Unable to create FuelType!');
                throw new HttpException(500, 'Unable to create FuelType!');
            }

            // Log success message
            logger.success('FuelType created successfully!');

            // Send success response
            res.status(200).send({
                status: 200,
                message: 'FuelType created successfully!',
            });
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while creating FuelType.' });
    }
}

exports.updateFuelType = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Update FuelType Params :', req.body);
        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'FuelType Id can not be empty!' });
            return;
        }
        fuelTypeCheckValidation(req);
        // Check if the FuelType already exists
        const fuelType = await FuelTypeModel.getAllFuelTypesQuery(req.body);

        if (fuelType && fuelType.length > 0) {
            logger.error('FuelType already exists!');
            res.status(400).send({ status: 400, message: 'FuelType already exists!' });
            return;
        }
        else {
            // Update the FuelType
            const result = await FuelTypeModel.updateFuelTypeQuery(req.body, req.params.id);

            // If update fails, throw an error
            if (result && result.affectedRows === 0) {
                logger.error('Unable to update FuelType!');
                throw new HttpException(500, 'Unable to update FuelType!');
            }

            // Log success message
            logger.success('FuelType updated successfully!');

            // Send success response
            res.status(200).send({
                status: 200,
                message: 'FuelType updated successfully!',
            })
        }

    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating FuelType.' });
    }
}

exports.deleteFuelType = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Delete FuelType Params :', req.body);
        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'FuelType Id can not be empty!' });
            return;
        }

        // Delete the FuelType
        const result = await FuelTypeModel.deleteFuelTypeQuery(req.params.id);

        // If deletion fails, throw an error
        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete FuelType!');
            throw new HttpException(500, 'Unable to delete FuelType!');
        }

        // Log success message
        logger.success('FuelType deleted successfully!');

        // Send success response
        res.status(200).send({
            status: 200,
            message: 'FuelType deleted successfully!',
        })
    } catch (err) {
        // Log error message
        logger.error(err.message);
        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting FuelType.' });
    }
}

//Function to validate request

fuelTypeCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};
