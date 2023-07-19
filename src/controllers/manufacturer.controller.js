const ManufacturerModel = require('../models/manufacturer.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

/**
 * Retrieve all manufacturers.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getAllManufacturers = async (req, res, next) => {
    try {

        let offset = req.query.pagenumber * req.query.limit ? req.query.pagenumber * req.query.limit : 0;

        const params = {
            limit: req.query.limit ? req.query.limit : 10,
            offset: offset
        }

        // Get the list of manufacturers
        const manufacturerList = await ManufacturerModel.findAllManufacturersQuery(params);

        // Log success message
        logger.success('Manufacturers fetched successfully!');

        // Send response
        res.status(200).send({
            status: 200,
            message: 'Manufacturers fetched successfully!',
            manufacturers: manufacturerList,
        });
    } catch (err) {
        // Log error message
        logger.error(err.message);

        // Send error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Manufacturers.' });
    }
};

/**
 * Get manufacturer by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.getManufacturerById = async (req, res, next) => {
    try {
        // Log the request parameters
        logger.info('Message : GetById Manufacturer Params :', req.params);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Manufacturer Id can not be empty!');
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        // Find the manufacturer by ID
        const manufacturer = await ManufacturerModel.findAllManufacturersQuery({ id: req.params.id });
        if (!manufacturer) {
            // Manufacturer not found
            logger.error('Message : Manufacturer not found!');
            res.status(404).send({
                status: 404,
                message: "Manufacturer not found!",
            });
        } else {
            // Manufacturer found
            res.status(200).send({
                status: 200,
                message: 'Manufacturer fetched successfully!',
                manufacturer: manufacturer
            })
        }
    } catch (err) {
        // Handle error
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while fetching Manufacturer.' });
    }
}

/**
 * Create a new manufacturer.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
exports.createManufacturer = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Create Manufacturer request', req.body);

        // Validate the request body
        manufacturerCheckValidation(req);

        // Check if the manufacturer already exists
        const manufacturer = await ManufacturerModel.findManufacturerByNameQuery(req.body);

        if (manufacturer) {
            logger.error('Manufacturer already exists!');

            res.status(400).send({ status: 400, message: 'Manufacturer already exists!' });
            return;
        } else {
            // Create the manufacturer
            const result = await ManufacturerModel.createManufacturerQuery(req.body);

            // If creation fails, throw an error
            if (!result) {
                logger.error('Unable to create Manufacturer!');
                throw new HttpException(500, 'Unable to create Manufacturer!');
            }

            // Log success message
            logger.success('Manufacturer created successfully!');

            // Send success response
            res.status(200).send({
                status: 200,
                message: 'Manufacturer created successfully!',
            });
        }
    } catch (err) {
        // Log and send error response
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while creating all Manufacturers.' });
    }
}

/**
 * Update a manufacturer.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.updateManufacturer = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Update Manufacturer request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }
        // Perform validation on the request body
        manufacturerCheckValidation(req);

        // Check if the manufacturer already exists
        const manufacturer = await ManufacturerModel.findManufacturerByNameQuery(req.body);

        if (manufacturer && manufacturer.Id != req.params.id) {
            logger.error('Manufacturer already exists!');
            res.status(400).send({ status: 400, message: 'Manufacturer already exists!' });
            return;
        } else {
            // Update the manufacturer
            const result = await ManufacturerModel.updateManufacturerQuery(req.body, req.params.id);

            if (result && result.affectedRows === 0) {
                logger.error('Unable to update Manufacturer!');
                throw new HttpException(500, 'Unable to update Manufacturer!');
            }

            logger.success('Manufacturer updated successfully!');

            res.status(200).send({
                status: 200,
                message: 'Manufacturer updated successfully!',
            });
        }
    } catch (err) {
        // Log and send error response
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while updating Manufacturer.' });
    }
}

/**
 * Delete a manufacturer
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.deleteManufacturer = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Delete Manufacturer request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            logger.error('Manufacturer Id can not be empty!');
            res.status(400).send({ message: 'Manufacturer Id can not be empty!' });
            return;
        }

        // Delete the manufacturer
        const result = await ManufacturerModel.deleteManufacturerQuery(req.params.id);

        // Check if the manufacturer was not found
        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete Manufacturer!');
            throw new HttpException(500, 'Unable to delete Manufacturer!');
        }

        // Log success message
        logger.success('Manufacturer deleted successfully!');

        // Send success response
        res.status(200).send({
            status: 200,
            message: 'Manufacturer deleted successfully!',
        });
    } catch (err) {
        // Log and send error response
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Manufacturer.' });
    }
}

manufacturerCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation Failed!', errors.errors[0].msg);
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};