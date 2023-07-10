const EnquiryModel = require('../models/enquiry.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

//Function to get user by Request Id from Database

exports.getAllEnquires = async (req, res, next) => {
    try {

        const enquiryList = await EnquiryModel.findAllEnquiriesQuery();
        logger.success('Enquiries fetched successfully!');

        res.status(200).send({
            status: 200,
            message: 'Enquiries fetched successfully!',
            Enquiries: enquiryList,
        });

    } catch (err) {
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Enquiries.' });
    };
};

//Function to create an user in Database

exports.createEnquiry = async (req, res, next) => {
    try {
        logger.info('Message: Create Enquiry request', req.body);
        enquiryCheckValidation(req);

        const result = await EnquiryModel.createEnquiryQuery(req.body);

        if (!result) {
            logger.error('Unable to create Enquiry!');
            throw new HttpException(500, 'Unable to create Enquiry!');
        }

        logger.success('Enquiry created successfully!');

        res.status(200).send({
            status: 200,
            message: 'Enquiry created successfully!',
        });
    } catch (err) {

        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while fetching all Enquiry.' });
    }
};

exports.deleteEnquiry = async (req, res, next) => {
    try {
        logger.info('Message: Delete Enquiry request', req.body);
        // Check if the ID is empty or invalid
        if (!req.params.id || req.params.id === ':id') {
            res.status(400).send({ message: 'FuelType Id can not be empty!' });
            return;
        }

        const result = await EnquiryModel.deleteEnquiryQuery(req.params.id);

        if (result && result.affectedRows === 0) {
            logger.error('Unable to delete Enquiry!');
            throw new HttpException(500, 'Unable to delete Enquiry!');
        }

        logger.success('Enquiry deleted successfully!');

        res.status(200).send({
            status: 200,
            message: 'Enquiry deleted successfully!',
        })
    } catch (err) {
        logger.error(err.message);
        res.status(500).send({ message: err.message || 'Some error occurred while deleting Enquiry.' });
    }
}
//Function to validate request

enquiryCheckValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException(400, errors.errors[0].msg, errors.errors[0].msg);
    }
};

