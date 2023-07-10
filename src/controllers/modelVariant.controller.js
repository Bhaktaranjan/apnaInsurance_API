const ModelVariantModel = require('../models/modelVariant.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

exports.getAllModelVariants = async (req, res, next) => {
    try {
        // Get the list of manufacturers
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

exports.createModelVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Create Model Variant Params :', req.body);

        const modelVariant = await ModelVariantModel.getAllModelVariantsQuery(req.body);

        if (modelVariant && modelVariant.length > 0) {
            logger.error('Model Variant already exists!');

            res.status(400).send({ status: 400, message: 'Model Variant already exists!' });
            return;
        } else {
            const result = await ModelVariantModel.createModelVariantQuery(req.body);

            if (!result) {
                logger.error('Unable to create model variant!');
                throw new HttpException(500, 'Unable to create model variant!');
            }

            logger.success('Model Variant created successfully!');

            res.status(200).send({
                status: 200,
                message: 'Model Variant created successfully!',
            })
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while creating Model Variant.' });
    }
}

exports.updateModelVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Update Model Variant Params :', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        const modelVariant = await ModelVariantModel.getAllModelVariantsQuery(req.body);

        if (modelVariant && modelVariant.length > 0) {
            logger.error('Model Variant already exists!');

            res.status(400).send({ status: 400, message: 'Model Variant already exists!' });
            return;
        } else {
            const result = await ModelVariantModel.updateModelVariantQuery(req.body, req.params.id);

            if (!result) {
                logger.error('Unable to update model variant!');
                throw new HttpException(500, 'Unable to update model variant!');
            }

            logger.success('Model Variant updated successfully!');

            res.status(200).send({
                status: 200,
                message: 'Model Variant updated successfully!',
            })
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while updating Model Variant.' });
    }
}

exports.deleteModelVariant = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : Delete Model Variant Params :', req.params);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        const result = await ModelVariantModel.deleteModelVariantQuery(req.params.id);

        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete model variant!');
            throw new HttpException(500, 'Unable to delete model variant!');
        } else {

            logger.success('Model Variant deleted successfully!');

            res.status(200).send({
                status: 200,
                message: 'Model Variant deleted successfully!',
            })
        }
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Model Variant.' });
    }
}