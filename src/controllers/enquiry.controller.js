const EnquiryModel = require('../models/enquiry.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

//Function to get user by Request Id from Database

/**
 * Retrieves all enquiries and sends a response with the list of enquiries.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getAllEnquires = async (req, res, next) => {
    try {
        const enquiries = await EnquiryModel.findAllEnquiriesQuery();
        res.status(200).send({
            message: 'Enquiries fetched successfully!',
            enquiries,
        });
    } catch (err) {
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Enquiries.' });
    }
};

/**
 * Create an enquiry.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
exports.createEnquiry = async (req, res, next) => {
    try {
        // Log the request body
        logger.info('Message: Create Enquiry request', req.body);

        // Validate the enquiry request
        enquiryCheckValidation(req);
        rtoFormatRegex(req);
        registrationNoFormat(req);
        manufactureYearValidation(req);
        // Create the enquiry using EnquiryModel
        const result = await EnquiryModel.createEnquiryQuery(req.body);

        // Check if the enquiry was created successfully
        if (!result) {
            logger.error('Unable to create Enquiry!');
            throw new HttpException(500, 'Unable to create Enquiry!');
        }

        // Log success message
        logger.success('Enquiry created successfully!');

        // Send the success response
        res.status(200).send({
            status: 200,
            message: 'Enquiry created successfully!',
        });
    } catch (err) {
        // Log the error message
        logger.error(err.message);

        // Send the error response
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Enquiry.' });
    }
};

/**
 * Deletes an enquiry.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.deleteEnquiry = async (req, res, next) => {
    try {
        // Log the delete enquiry request
        logger.info('Message: Delete Enquiry request', req.body);

        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'FuelType Id can not be empty!' });
            return;
        }

        // Delete the enquiry
        const result = await EnquiryModel.deleteEnquiryQuery(req.params.id);

        // Check if the enquiry was deleted successfully
        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete Enquiry!');
            throw new HttpException(500, 'Unable to delete Enquiry!');
        }

        // Log the success message
        logger.success('Enquiry deleted successfully!');

        // Send the success response
        res.status(200).send({
            status: 200,
            message: 'Enquiry deleted successfully!',
        });
    } catch (err) {
        // Log and send the error message
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Enquiry.' });
    }
};
//Function to validate request

/**
 * Checks the validation of an enquiry request.
 * Throws an HttpException if there are validation errors.
 * @param {object} req - The enquiry request object.
 */
const enquiryCheckValidation = (req) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const firstErrorMessage = validationErrors.errors[0].msg;
        throw new HttpException(400, firstErrorMessage, firstErrorMessage);
    }
};

const rtoFormatRegex = (req) => {
    const regex = /^[A-Z]{2}[-][0-9]{2}$/;
    if (!regex.test(req.body.RtoRegistered)) {
        throw new HttpException(400, 'RtoRegistered is not valid! Please enter valid RtoRegistered (e.g. MH-02)');
    }
}

const registrationNoFormat = (req) => {
    const regex = /^[A-Z]{2}[-][0-9]{1,2}(?:-[A-Z]{1,2})[-][0-9]{4}$/;
    if (!regex.test(req.body.RegistrationNumber)) {
        throw new HttpException(400, 'RegistrationNumber is not valid! Please enter valid RegistrationNumber (e.g. MH-02--CD-1234)');
    }
}

const manufactureYearValidation = (req) => {
    const currentYear = new Date().getFullYear();
    const validateYear = currentYear - 15;

    if (currentYear < req.body.YearOfManufacture || req.body.YearOfManufacture < validateYear) {
        throw new HttpException(400, `YearOfManufacture is not valid! Please enter valid YearOfManufacture (e.g. greaterthan ${validateYear - 1})`);
    }
}