const EnquiryModel = require('../models/enquiry.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');


// const getPagination = (_page, _limit) => {
//     const limit = _limit ? +_limit : 20;
//     const offset = _page ? _page * limit : 0;
//     console.log('limit', limit);
//     console.log('offset', offset);
//     return { limit, offset };
// };

//get paginated data and organise it into totalItems, items, totalPages, currentPage
// const getPagingData = (AllEnquiries, enquiries, page, limit) => {
//     // console.log(data);
//     // console.log('data.length', data.length);
//     const totalItems = AllEnquiries.length;
//     // const { rows: items } = data;
//     const currentPage = page ? +page : 0;
//     const totalPages = Math.ceil(totalItems / limit);
//     console.log('page', page);
//     console.log('currentPage', currentPage);
//     return { enquiries, totalItems, totalPages, currentPage };
// };


//Function to get user by Request Id from Database

/**
 * Retrieves all enquiries and sends a response with the list of enquiries.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getAllEnquires = async (req, res, next) => {
    // const { _page, _limit } = req.query;
    // const { limit, offset } = getPagination(_page, _limit);
    // console.log('_limit', _limit);
    // console.log('_page', _page);
    try {
        // let offset = (req.query.pagenumber + 1) * req.query.limit ? (req.query.pagenumber + 1) * req.query.limit : 0;
        // let numPerPage = 20;
        // const pagenumber = req.query.pagenumber ? req.query.pagenumber : 1;
        // const skip = (pagenumber - 1) * req.query.offset;
        // let offset = skip + ',' + req.query.offset;
        // const params = {
        //     // limit: req.query.limit ? req.query.limit : 10,
        //     offset: offset
        // }
        const enquiries = await EnquiryModel.findAllEnquiriesQuery();
        // const enquiries = await EnquiryModel.findAllEnquiriesQuery({
        //     limit,
        //     offset
        // });
        // // console.log(users);
        // const response = getPagingData(AllEnquiries, enquiries, _page, limit);

        res.status(200).send({
            message: 'Enquiries fetched successfully!',
            enquiries,
        });
    } catch (err) {
        logger.error(err.message);
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
        cubicCapacityValidation(req);
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


// ************************ Update enquire status******************************

exports.updateEnquiryStatus = async (req, res, next) => {
    try {
        logger.info('Message: Update Enquiry Status request', req.body);

        if (!req.params.id || req.params.id === ':id') {
            logger.error('Enquiry Id can not be empty!');
            res.status(400).send({ message: 'Enquiry Id can not be empty!' });
            return;
        }

        const result = await EnquiryModel.updateEnquireStatusQuery(req.body, req.params.id);
        if (result && result.affectedRows === 0) {
            logger.error('Unable to update Enquire!');
            throw new HttpException(500, 'Unable to update enquire!');
        }
        const updatedEnquiry = await EnquiryModel.getEnquiryById(req.params.id);
        logger.success('enquire status updated successfully!');

        res.status(200).send({
            status: 200,
            message: 'enquire updated successfully!',
            data: updatedEnquiry
        });

    } catch (error) {
        // Log and send error response
        logger.error(error.message);
        res.status(500).send({ message: error.message || 'Some error occurred while updating enquire.' });
    }
}

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
            logger.error('Enquiry Id can not be empty!');
            res.status(400).send({ message: 'Enquiry Id can not be empty!' });
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
        logger.error('Validation Failed!', validationErrors.errors[0].msg);
        const firstErrorMessage = validationErrors.errors[0].msg;
        throw new HttpException(400, firstErrorMessage, firstErrorMessage);
    }
};

const rtoFormatRegex = (req) => {
    const rtoRegex = /^[A-Z]{2}[-][0-9]{2}$/;

    if (!rtoRegex.test(req.body.RtoRegistered)) {
        logger.error('RtoRegistered is not valid!');
        throw new HttpException(400, 'RtoRegistered is not valid! Please enter valid RtoRegistered (e.g. MH-02)');
    }
}

const registrationNoFormat = (req) => {
    const regiNoRegex = /^[A-Z]{2}[-][0-9]{1,2}(?:-[A-Z]{1,2})[-][0-9]{4}$/;

    if (!regiNoRegex.test(req.body.RegistrationNumber)) {
        logger.error('RegistrationNumber is not valid!');
        throw new HttpException(400, 'RegistrationNumber is not valid! Please enter valid RegistrationNumber (e.g. MH-02--CD-1234)');
    }
}

const manufactureYearValidation = (req) => {
    const currentYear = new Date().getFullYear();
    const validateYear = currentYear - 15;

    if (currentYear < req.body.YearOfManufacture || req.body.YearOfManufacture < validateYear) {
        logger.error('YearOfManufacture is not valid!');
        throw new HttpException(400, `YearOfManufacture is not valid! Please enter valid YearOfManufacture (e.g. greaterthan ${validateYear - 1})`);
    }
}

const cubicCapacityValidation = (req) => {
    const cubicCapacityRegex = /^[1-9]{1}[0-9]{3}$/;

    if (!cubicCapacityRegex.test(req.body.CubicCapacity || req.body.CubicCapacity === '')) {
        logger.error('CubicCapacity is not valid!');
        throw new HttpException(400, 'CubicCapacity is not valid! Please enter valid CubicCapacity (e.g. 4000)');
    }
}