const MakeVariant = require('../models/variant.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

/**
 * Retrieves all model variants.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.getAllVariants = async (req, res, next) => {
    try {
        let offset = req.query.pagenumber * req.query.limit ? req.query.pagenumber * req.query.limit : 0;

        const params = {
            limit: req.query.limit ? req.query.limit : 10,
            offset: offset
        }
        // Get the list of model s
        const variantList = await MakeVariant.getAllVariantsWithVehicleModelNameQuery();

        // Log success message
        logger.success('variant fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'variant fetched successfully!',
            variants: variantList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all variant.' });
    }
}

exports.getAllVariantsByVehicleModelId = async (req, res, next) => {
    try {
        logger.info('Message : Get variant Params :', req.params);

        // Check if the ID is empty or invalid

        if (!req.params.vehicleId || req.params.vehicleId === ':vehicleId') {
            logger.error('Vehicle Id can not be empty!');
            res.status(400).send({ message: 'Vehicle Id can not be empty!' });
            return;
        }
        const modelList = await MakeVariant.getAllVariantsByVehicleModelIdQuery(req.params.vehicleId);

        logger.success('variant fetched successfully!');

        res.status(200).send({
            status: 200,
            message: 'variant fetched successfully!',
            models: modelList
        });
    } catch (err) {
        logger.error(err.message);

        res.status(500).send({ message: err.message || 'Some error occurred while fetching all variant.' });
    }
}

/**
 * Create a model.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.createVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Create variant Params :', req.body);


        // Check if the request body is valid
        modelCheckValidation(req);

        // Get all existing model s
        const models = await MakeVariant.getAllVariantsQuery(req.body);

        // If a model  already exists, return an error
        if (models) {
            logger.error('variant already exists!');
            res.status(409).send({ status: 409, message: 'variant already exists!' });
            return;
        } else {
            // Create a new model 
            const result = await MakeVariant.createVariantQuery(req.body);

            // If unable to create the model , throw an error
            if (!result) {
                logger.error('Unable to create variant!');
                throw new HttpException(500, 'Unable to create variant!');
            }

            logger.success('variant created successfully!');

            // Send a success response
            res.status(200).send({
                status: 200,
                message: 'variant created successfully!',
            })
        }
    } catch (err) {
        // Log the error message
        logger.error(err.message);

        // Send an error response
        res.status(500).send({ message: err.message || 'Some error occurred while creating Model.' });
    }
}

/**
 * Update a model .
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.updateVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Update variant Params :', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Manufacturer Id can not be empty!');
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        // Validate the request body
        modelCheckValidation(req);

        // Check if the model  already exists
        const model = await MakeVariant.getAllVariantsQuery(req.body);

        if (model && model.Id != req.params.id) {
            logger.error('Variant already exists!');

            res.status(409).send({ status: 409, message: 'variant already exists!' });
            return;
        } else {
            // Update the model 
            const result = await MakeVariant.updateVariantQuery(req.body, req.params.id);

            if (result && result.affectedRows === 0) {
                logger.error('Unable to update variant!');
                throw new HttpException(500, 'Unable to update variant!');
            }

            logger.success('variant updated successfully!');

            res.status(200).send({
                status: 200,
                message: 'variant updated successfully!',
            });
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating variant.' });
    }
}

/**
 * Delete a model .
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.deleteVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message: Delete Model Params:', req.params);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Manufacturer Id can not be empty!');
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        const result = await MakeVariant.deleteVariantQuery(req.params.id);

        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete variant!');
            throw new HttpException(500, 'Unable to delete variant!');
        }

        logger.success('variant deleted successfully!');

        res.status(200).send({
            status: 200,
            message: 'variant deleted successfully!',
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Model.' });
    }
}

modelCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation Failed!', errors.errors[0].msg);
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};