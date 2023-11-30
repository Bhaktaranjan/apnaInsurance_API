
const HttpException = require('../utils/HttpException.utils');
const logger = require('../middleware/logger');
const documentmodel = require("../models/document.model");
const fs = require("fs");
const path = require('path');
const dotenv = require("dotenv");
dotenv.config()
// const { log } = require('console');
// const { error, log } = require('console');
// const { validationResult } = require('express-validator');
// const upload = require('../middleware/validators/filevalidator.middleware');

exports.CreateDocument = async (req, res, next) => {
    logger.info(" uploaded File:", req.body);

    try {

        if (!req.file) {
            logger.error(" No file were uploaded")
            return res.status(400).send({ message: "No file were uploaded" })
        };

        const data = {
            DocumentName: req.body.documentname,
            FileName: req.file.filename,
            EnquiryId: req.body.EnquiryId,
            CreatedBy: req.body.CreatedBy
        };

        logger.info('Payload Data:', data);
        const result = await documentmodel.createDocument(data);

        if (!result) {
            logger.error('Unable to upload the file!');
            throw new HttpException(500, 'Unable to upload the file!');
        } else {
            logger.success('Document Upload successfull');
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
    const documentDirectory = `./${process.env.FILE_UPLOAD_DIR}`;
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
    logger.info("Enquiry Id: ", req.params.enquiryid);
    try {

        if (!req.params.enquiryid || req.params.enquiryid == ":enquiryid") {
            logger.error('Enquiry can not be empty!');
            res.status(400).send({ message: 'Enquiry Id can not be empty!' });
            return;
        }

        const documentlist = await documentmodel.getAlldocumentByEnquireId(req.params.enquiryid);

        if (!documentlist) {
            logger.error("Document not fetched")
            res.status(400).send({ message: "Document not fetched" })
        } else {
            documentlist.map((item) => {
                item.filePath = findFilePathByFileName(item.FileName)
            })

            logger.success("document fetched successfully")
            res.send({ status: 200, message: "Document fetched Successfully", document: documentlist });
            // res.download(`'${documentlist[4].FileName}'`);
        }

    } catch (error) {
        logger.error(error.message);
        res.status(500).send({ message: error.message })
    }

}

exports.getDocumentById = async (req, res, next) => {
    logger.info("Document Id: ", req.params.Id)

    try {

        if (!req.params.id || req.params.Id == ":id") {
            logger.error("Id can not be empty!");
            return res.status(400).send({ message: "Id can not be empty" });
        }
        const document = await documentmodel.getDocumentbyId(req.params.id);

        if (document && document.length == 0) {
            logger.error(" Document not present for this Id : ", req.params.id);
            return res.status(400).send({ message: "Document not present for this Id" })
        }
        next()
    } catch (error) {
        logger.error(error.message);
        res.status(500).send({ message: error.message });
    }
}


exports.updateDocumentById = async (req, res, next) => {
    logger.info("upload File:", req.file);
    try {

        if (!req.params.id || req.params.id === ":id") {
            logger.error("Id can not be empty!");
            return res.status(400).send({ message: "Id can not be empty" });
        }

        if (!req.body.FileName || req.body.FileName === "" || req.body.FileName === ":filename") {
            logger.error("Filename can not be empty");
            return res.status(400).send({ message: "Filename can not be empty" });
        }

        // if (req.body.FileName && req.body.FileName.includes('\n')) {
        //     req.body.FileName = req.body.FileName.replace(/\n/g, '');
        // }


        if (!req.file) {
            logger.error(" No file were uploaded.");
            return res.status(400).send({ message: "Please upload a file" });
        }

        const result = await documentmodel.updateDocument(req.file.filename, req.body.EditedBy, req.body.EditedOn, req.params.id);

        if (!result) {
            logger.error('Unable to update Document!');
            throw new Error('Unable to update Document');
        } else {
            fs.unlink(`./${process.env.FILE_UPLOAD_DIR}/${req.body.FileName}`, (error) => {

                if (error) {
                    logger.error('Error in deleting the file:', error);
                    return res.status(500).send({ message: error.message });
                }
                logger.success("Existing file deletion successful");
                logger.success("Document update successful");
                res.status(200).send({ status: 200, message: "Document updated successfully", result: result });
            })

        }


    } catch (error) {
        logger.error(error.message);
        res.status(500).send({ message: error.message });
    }
};


exports.downloadDocumentByPath = (req, res, next) => {
    try {
        logger.info("req data:", req.params)
        const fileName = req.params.filename;
        if(!fileName || fileName===":filename" || fileName===""){
            logger.error("Filename can not be empty!")
            return res.status(400).send({ message: "Filename can not be empty!" });
        }
        const filepath = findFilePathByFileName(fileName)
        logger.info("File Path :", filepath)

        if (fs.existsSync(filepath)) {
            res.download(filepath, fileName, (err) => {

                if (err) {
                    logger.error("Error in downloading file:", err);
                    res.status(500).send({ message: err.message });
                }
                logger.success("Document download successfull")

            });
        } else {
            logger.error(" File not found of this path: ", filepath);
            res.status(400).send({ message: "File not found!" })
        }

    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

exports.viewDocument=(req,res,next)=>{
    try {

        logger.info("req data:", req.params)
        const fileName = req.params.filename;

        if(!fileName || fileName===":filename" || fileName===""){
            logger.error("Filename can not be empty!")
            return res.status(400).send({ message: "Filename can not be empty!" });
        }
        const filepath = findFilePathByFileName(fileName)
        logger.info("File Path :", filepath)
        
        if(fs.existsSync(filepath)){
            logger.success("Find filepath successfull.");
            logger.success("Send file successfull")
            res.sendFile(path.join(`${process.env.ROOT_DIR}`, `./${process.env.FILE_UPLOAD_DIR}/`, fileName));

        }else{
            logger.error(" File not found of this path: ", filepath);
            res.status(400).send({ message: "File not found!" })
        }
       
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
}

