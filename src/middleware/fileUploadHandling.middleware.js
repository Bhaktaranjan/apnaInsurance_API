const multer = require('multer');
const dotenv = require("dotenv")
const EnquiryModel = require('../models/enquiry.model');
const fs = require('fs');
const path = require('path');
const HttpException = require('../utils/HttpException.utils');
const { constants } = require('fs/promises');
const { isArray } = require('util');
dotenv.config();

const findData = async (req) => {
    if (req.EnquiryId) {
        // throw new HttpException(400, 'Enquiry Id is required');
        const enquiry = await EnquiryModel.getEnquiryById(req.EnquiryId);
        return enquiry;
    }
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const enquiryData = await findData(req.body);

        const uploadDir = `./${process.env.FILE_UPLOAD_DIR}/${enquiryData.RegistrationNumber}_${enquiryData.Id}`;

        // Create the destination directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const modifiedFileName = originalName.replace(/\s+/g, '_');

        cb(null, `${file.fieldname}_${Date.now()}_${modifiedFileName}`);
    }
});

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: parseInt(process.env.FILE_MAX_LIMIT),
    // },

    fileFilter(req, file, cb, err) {
        var allowedFileMimetypes = [];

        if (Array.isArray(JSON.parse(process.env.ALLOWED_FILE_MIMETYPES))) {

            for (let index = 0; index < JSON.parse(process.env.ALLOWED_FILE_MIMETYPES).length; index++) {
                const element = JSON.parse(process.env.ALLOWED_FILE_MIMETYPES)[index];
                allowedFileMimetypes.push(element.mimetype);
            }

            if (allowedFileMimetypes && allowedFileMimetypes.includes(file.mimetype.toLowerCase())) {

                req.file = file;
                cb(null, true);
            } else {
                req.file = false;
                cb(null, false);
            }
        }
    }
});
module.exports = upload;