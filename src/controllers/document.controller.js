
const HttpException = require('../utils/HttpException.utils');
const logger = require('../middleware/logger');
const documentmodel = require("../models/document.model");
const fs = require("fs");
const path = require('path');
// const { log } = require('console');
// const { error, log } = require('console');
// const { validationResult } = require('express-validator');
// const upload = require('../middleware/validators/filevalidator.middleware');

exports.CreateDocument = async (req, res, next) => {
    logger.info("Message: upload File:", req.body);

    try {

        if (!req.file) {
            logger.error("Message: No file were uploaded")
            return res.status(400).send({ message: "No file were uploaded" })
        };

        const data = {
            DocumentName: req.body.documentname,
            FileName: req.file.filename,
            EnquiryId: req.body.EnquiryId,
            CreatedBy: req.body.CreatedBy
        };

        logger.info('Message: Payload Data : ', data);
        const result = await documentmodel.createDocument(data);

        if (!result) {
            logger.error('Unable to create Document!');
            throw new HttpException(500, 'Unable to create Document!');
        } else {
            logger.success('Message: Document Upload successfully');

            // Send success response
            res.status(200).send({
                status: 200,
                message: 'Document Uploaded successfully',
            });
        };

    } catch (error) {
        logger.error(error.message)
        res.send({ message: error.message })
    }
};

// ************function for find filepath by file name******************

const findFilePathByFileName = (filename) => {
    const documentDirectory = './document';
    const filesInDirectory = fs.readdirSync(documentDirectory);
    const foundFile = filesInDirectory.find(file => file === filename);

    if (foundFile) {
        const filePath = path.join(documentDirectory, foundFile);
        return filePath;

    } else {
        logger.error("Message: file not found for the provided filename", filename);
        return null
    }
};



exports.getAllDocumentByEnquiryId = async (req, res, next) => {
    logger.info("Message: Enquiry Id: ", req.params.enquiryid);
    try {

        if (!req.params.enquiryid || req.params.enquiryid == ":enquiryid") {
            logger.error('Message:Enquiry Id cannot be empty!');
            res.status(400).send({ message: 'Enquiry Id can not be empty!' });
            return;
        }

        const documentlist = await documentmodel.getAlldocumentByEnquireId(req.params.enquiryid);
        console.log("line 81", documentlist)

        if (!documentlist) {
            res.status(400).send({ message: "Document not frtched" })
        } else {

            documentlist.map((item) => {
                item.filePath = findFilePathByFileName(item.FileName)
            })

            logger.success("Message:document fetched successfull")
            res.send({ status: 200, message: "Document fetched Successfully", document: documentlist });
            // res.download(`'${documentlist[4].FileName}'`);
        }

    } catch (error) {
        logger.error("Message: ", error.message);
        res.status(500).send({ message: error.message })
    }

}

exports.getDocumentById = async (req, res, next) => {
    logger.info("Message : Document Id: ", req.params.Id)

    try {

        if (!req.params.id || req.params.Id == ":id") {
            logger.error("Id can not be empty!");
            return res.status(400).send({ message: "Id can not be empty" });
        }
        const document = await documentmodel.getDocumentbyId(req.params.id)
        console.log("documentt", document)

        if (document.length == 0) {
            logger.error("Message : Document not present for this Id : ", req.params.id);
            return res.status(400).send({ message: "Document not present for the Id" })
        }
        next()
    } catch (error) {
        logger.info("Message : Error from getDocumentById")
        logger.error(error.message);
        res.status(500).send({ message: error.message });
    }
}


exports.updateDocumentById = async (req, res, next) => {
    logger.info("Message : upload File:", req.file);
    try {

        if (!req.params.id || req.params.id === ":id") {
            logger.error("Message : Id can not be empty!");
            return res.status(400).send({ message: "Id can not be empty" });
        }

        if (!req.body.FileName || req.body.FileName === "") {
            logger.error("Message : Filename can not be empty");
            return res.status(400).send({ message: "Filename cannot be empty" });
        }

        // if (req.body.FileName && req.body.FileName.includes('\n')) {
        //     req.body.FileName = req.body.FileName.replace(/\n/g, '');
        // }


        if (!req.file) {
            logger.error("Message : No files were uploaded.");
            return res.status(400).send({ message: "No files were uploaded" });
        }

        const result = await documentmodel.updateDocument(req.file.filename, req.body.EditedBy, req.body.EditedOn, req.params.id);

        if (!result) {
            logger.error('Unable to update Document!');
            throw new Error('Unable to update Document');
        } else {
            fs.unlink(`./document/${req.body.FileName}`, (error) => {

                if (error) {
                    logger.error('Message : Error in deleting the file:', error);
                    return res.status(500).send({ message: error.message });
                }
                logger.success("Message : Existing file deletion successful");
                logger.success("Message : Document update successful");
                res.status(200).send({ status: 200, message: "Document updated successfully", result: result });
            })

        }


    } catch (error) {
        logger.info("Message : Error from updateDocumentById");
        logger.error("Message :", error.message);
        res.status(500).send({ message: error.message });
    }
};


exports.downloadDocumentByPath = (req, res, next) => {
    try {
        logger.info("Message: req body:", req.params)
        const fileName = req.params.filename;
        const filepath = findFilePathByFileName(fileName)
        logger.info("Message: File Path :", filepath)

        if (fs.existsSync(filepath)) {
            res.download(filepath, fileName, (err) => {

                if (err) {
                    logger.error("Message : Error downloading file:", err);
                    res.status(500).send({ message: err.message });
                }
                logger.success("Message: Document download successfull")

            });
        } else {
            logger.error("Message : File not found of this path: ", filepath);
            res.status(400).send({ message: "File not found" })
        }

    } catch (error) {
        console.error('Message: Internal server error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

