const multer = require('multer');
const dotenv=require("dotenv")
// const path = require('path');
dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./${process.env.FILE_UPLOAD_DIR}`);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const modifiedFileName = originalName.replace(/\s+/g, '_'); // Replace spaces with underscores

        // Create the filename by combining fieldname, current timestamp, and modified filename
        cb(null, `${file.fieldname}_${Date.now()}_${modifiedFileName}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        // const allowedExtensions = ['.ppt', '.pdf'];
        // const fileExtension = path.extname(file.originalname).toLowerCase();
        // if (!allowedExtensions.includes(fileExtension)) {
        //     return cb(new Error(`File format not supported. Please upload a .pptx or .pdf file`));
        // }
        req.file = file;
        cb(null, true);
    }
});
module.exports = upload;