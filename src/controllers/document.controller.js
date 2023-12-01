
const HttpException = require('../utils/HttpException.utils');
const logger = require('../middleware/logger');
const documentmodel = require("../models/document.model");
const fs = require("fs");
const path = require('path');
const dotenv = require("dotenv");
const { validationResult } = require('express-validator');
const EnquiryModel = require('../models/enquiry.model');
dotenv.config()

const findData = async (id) => {
    if (!id) {
        throw new HttpException(400, 'Enquiry Id is required');
    }
    const enquiry = await EnquiryModel.getEnquiryById(id);
    return enquiry;
}

exports.CreateDocument = async (req, res, next) => {
    logger.info(" uploaded File:", req.body);

    try {
        documentCheckValidation(req);

        const data = {
            DocumentName: req.body.DocumentName,
            FileName: req.file.filename,
            EnquiryId: req.body.EnquiryId,
            CreatedBy: req.body.CreatedBy
        };

        logger.info('Requested Payload Data:', data);
        const result = await documentmodel.createDocument(data);

        if (!result) {
            logger.error('Unable to upload the file!');
            throw new HttpException(500, 'Unable to upload the file!');
        } else {
            logger.success('Document Uploaded Successfully');
            res.status(200).send({
                status: 200,
                message: 'Document Uploaded Successfully',
            });
        };

    } catch (error) {
        logger.error(error.message)
        res.send({ message: error.message || 'Some Error Ocurred while uploading Document' })
    }
};

// ************function for find filepath by file name******************

const findFilePathByFileName = async (filename, id) => {
    const enquiry = await findData(id);
    const documentDirectory = `./${process.env.FILE_UPLOAD_DIR}/${enquiry.RegistrationNumber}_${id}`;
    const filesInDirectory = fs.readdirSync(documentDirectory);
    const foundFile = filesInDirectory.find(file => file === filename);

    if (foundFile) {
        const filePath = path.join(documentDirectory, foundFile);
        return filePath;

    } else {
        logger.error("file not found for the provided filename:", filename);
        return null
    }
};


exports.getAllDocumentByEnquiryId = async (req, res, next) => {
    logger.info("Requested Params: ", req.params.enquiryid);
    try {

        if (!req.params.enquiryid || req.params.enquiryid == ":enquiryid") {
            logger.error('EnquiryID can not be empty!');
            res.status(400).send({ message: 'EnquiryID can not be empty!' });
            return;
        }

        const documentlist = await documentmodel.getAlldocumentByEnquireId(req.params.enquiryid);

        if (!documentlist) {
            logger.error("Unable to fetch Document")
            res.status(400).send({ message: "Unable to fetch Document" })
        } else {
            documentlist.map((item) => {
                item.filePath = findFilePathByFileName(item.FileName, req.params.enquiryid)
            })

            logger.success("Documents fetched Successfully")
            res.send({ status: 200, message: "Documents fetched Successfully", document: documentlist });
            // res.download(`'${documentlist[4].FileName}'`);
        }

    } catch (error) {
        logger.error(error.message);
        res.status(500).send({ message: error.message || 'Some Error Ocurred while Getting All Document' })
    }

}

exports.getDocumentById = async (req, res, next) => {
    logger.info("Requested Params: ", req.params.id)

    try {
        if (!req.params.id || req.params.id == ":id") {
            logger.error("Id can not be empty!");
            return res.status(400).send({ message: "Id can not be empty" });
        }
        const document = await documentmodel.getDocumentbyId(req.params.id);
        if (document && document.length == 0) {
            logger.error(" Document not found for this Id : ", req.params.id);
            return res.status(400).send({ message: "Document not found for this Id" })
        }
        next()
    } catch (error) {
        logger.error(error.message);
        res.status(500).send({ message: error.message || 'Some Error Ocurred while Getting Document' });
    }
}


exports.updateDocumentById = async (req, res, next) => {
    logger.info("Requested File to update:", req.file);
    logger.info('Requested Body to update', req.body);
    try {

        if (!req.params.id || req.params.id === ":id") {
            logger.error("Id can't be empty!");
            return res.status(400).send({ message: "Id can't be empty" });
        }

        if (!req.body.FileName || req.body.FileName === "" || req.body.FileName === ":filename") {
            logger.error("Filename can't be empty" + req.body.FileName);
            return res.status(400).send({ message: "Filename can't be empty" });
        }
        documentCheckValidation(req);

        if (!req.file) {
            logger.error(" Please select a file to upload");
            return res.status(400).send({ message: "Please select a file to upload" });
        }

        const result = await documentmodel.updateDocument(req.file.filename, req.body.EditedBy, new Date(Date.now()), req.params.id);

        if (!result) {
            logger.error('Unable to update Document');
            throw new Error('Unable to update Document');
        } else {
            const filepath = await findFilePathByFileName(req.body.FileName, req.body.EnquiryId);

            if (filepath) {
                fs.unlink(`./${filepath}`, (error) => {

                    if (error) {
                        logger.error('Error in deleting the file:', error);
                        return res.status(500).send({ message: error.message });
                    }
                    logger.success("Document Updated Successfully with deleted existing file from DIR:", `./${filepath}`);
                    res.status(200).send({ status: 200, message: "Document updated Successfully", result: result });
                })
            }
        }

    } catch (error) {
        logger.error(error.message);
        res.status(500).send({ message: error.message || 'Some Error Ocurred while Update Document' });
    }
};


exports.downloadDocumentByPath = async (req, res, next) => {
    try {
        logger.info("Requested Params:", req.params);

        if (!req.params.filename || req.params.filename === ":filename" || req.params.filename === "") {
            logger.error("Filename can not be empty")
            return res.status(400).send({ message: "Filename can not be empty" });
        }
        const filepath = await findFilePathByFileName(req.params.filename, req.body.EnquiryId);
        logger.info("Found file Path by fileName for Download Document:", filepath)

        if (filepath && fs.existsSync(filepath)) {
            res.download(filepath, req.params.filename, (err) => {

                if (err) {
                    logger.error("Error in downloading file:", err);
                    res.status(500).send({ message: err.message });
                }
                logger.success("Document download Successfully")

            });
        } else {
            logger.error(" File not found for this path: ", filepath);
            res.status(400).send({ message: "File not found" })
        }

    } catch (error) {
        logger.error(error);
        res.status(500).send({ message: error.message || 'Some Error Ocurred while Download Document' });
    }
};

exports.viewDocument = async (req, res, next) => {
    try {

        logger.info("Requested Params:", req.params);
        logger.info("Requested Body:", req.body);

        if (!req.params.filename || req.params.filename === ":filename" || req.params.filename === "") {
            logger.error("Filename can not be empty!")
            return res.status(400).send({ message: "Filename can not be empty" });
        }
        const filepath = await findFilePathByFileName(req.params.filename, req.body.EnquiryId);
        logger.info("Found file Path by fileName for View Document:", filepath)

        if (fs.existsSync(filepath)) {
            logger.success("Found file and send Successfully.");
            res.sendFile(path.join(__dirname, `../../${filepath}`));

        } else {
            logger.error(" File not found for this path: ", filepath);
            res.status(400).send({ message: "Unable to find the file" })
        }

    } catch (error) {
        logger.error(error);
        res.status(500).send({ message: error.message || 'Some Error Ocurred while View Document' });
    }
}

const documentCheckValidation = (req) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        logger.error('Validation Failed!', validationErrors.errors[0].msg);
        const firstErrorMessage = validationErrors.errors[0].msg;
        throw new HttpException(400, firstErrorMessage, firstErrorMessage);
    }
};