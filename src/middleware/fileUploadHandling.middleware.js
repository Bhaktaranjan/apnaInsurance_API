const multer = require('multer');
const dotenv = require("dotenv")
const EnquiryModel = require('../models/enquiry.model');
const fs = require('fs');
const path = require('path');
dotenv.config();

const findData = async (req) => {
    if (!req.EnquiryId) {
        throw new HttpException(400, 'Enquiry Id is required');
    }
    const enquiry = await EnquiryModel.getEnquiryById(req.EnquiryId);
    return enquiry;
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
    fileFilter(req, file, cb) {
        const allowedExtensions = ['.ppt', '.pdf', '.doc', '.docx', '.pptx'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error(`File format not supported. Allowed formats: ${allowedExtensions.join(', ')}`));
        }
        req.file = file;
        cb(null, true);
    }
});
module.exports = upload;