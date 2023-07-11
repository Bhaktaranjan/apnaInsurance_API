const ModelVariantModel = require('../models/modelVariant.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

/**
 * Retrieves all model variants.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.getAllModelVariants = async (req, res, next) => {
    try {
        // Get the list of model variants
        const modelVariantList = await ModelVariantModel.getAllModelVariantsQuery();

        // Log success message
        logger.success('Model Variants fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Model Variants fetched successfully!',
            modelVariants: modelVariantList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Model Variants.' });
    }
}

exports.getAllModelVariantsByVehicleModelId = async (req, res, next) => {
    try {
        logger.info('Message : Get Model Variant Params :', req.params);

        const modelVariantList = await ModelVariantModel.getAllModelVariantsByVehicleModelIdQuery(req.params.vehiclemodelid);

        logger.success('Model Variants fetched successfully!');

        res.status(200).send({
            status: 200,
            message: 'Model Variants fetched successfully!',
            modelVariants: modelVariantList
        });
    } catch (err) {
        logger.error(err.message);

        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Model Variants.' });
    }
}

/**
 * Create a model variant.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.createModelVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Create Model Variant Params :', req.body);

        // Check if the request body is valid
        modelVariantCheckValidation(req);

        // Get all existing model variants
        const modelVariants = await ModelVariantModel.getAllModelVariantsQuery(req.body);

        // If a model variant already exists, return an error
        if (modelVariants && modelVariants.length > 0) {
            logger.error('Model Variant already exists!');
            res.status(400).send({ status: 400, message: 'Model Variant already exists!' });
            return;
        } else {
            // Create a new model variant
            const result = await ModelVariantModel.createModelVariantQuery(req.body);

            // If unable to create the model variant, throw an error
            if (!result) {
                logger.error('Unable to create model variant!');
                throw new HttpException(500, 'Unable to create model variant!');
            }

            logger.success('Model Variant created successfully!');

            // Send a success response
            res.status(200).send({
                status: 200,
                message: 'Model Variant created successfully!',
            })
        }
    } catch (err) {
        // Log the error message
        logger.error(err.message);

        // Send an error response
        res.status(500).send({ message: err.message || 'Some error occurred while creating Model Variant.' });
    }
}

/**
 * Update a model variant.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.updateModelVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Update Model Variant Params :', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        // Validate the request body
        modelVariantCheckValidation(req);

        // Check if the model variant already exists
        const modelVariant = await ModelVariantModel.getAllModelVariantsQuery(req.body);

        if (modelVariant && modelVariant.length > 0) {
            logger.error('Model Variant already exists!');

            res.status(400).send({ status: 400, message: 'Model Variant already exists!' });
            return;
        } else {
            // Update the model variant
            const result = await ModelVariantModel.updateModelVariantQuery(req.body, req.params.id);

            if (result && result.affectedRows === 0) {
                logger.error('Unable to update model variant!');
                throw new HttpException(500, 'Unable to update model variant!');
            }

            logger.success('Model Variant updated successfully!');

            res.status(200).send({
                status: 200,
                message: 'Model Variant updated successfully!',
            });
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating Model Variant.' });
    }
}

/**
 * Delete a model variant.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.deleteModelVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message: Delete Model Variant Params:', req.params);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        const result = await ModelVariantModel.deleteModelVariantQuery(req.params.id);

        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete model variant!');
            throw new HttpException(500, 'Unable to delete model variant!');
        }

        logger.success('Model Variant deleted successfully!');

        res.status(200).send({
            status: 200,
            message: 'Model Variant deleted successfully!',
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Model Variant.' });
    }
}

modelVariantCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};