const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './document');
    },
    filename: (req, file, cb) => {
        cb(null, (file_name = file.fieldname + Date.now() + file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        // const allowedExtensions = ['.ppt', '.pdf'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        // if (!allowedExtensions.includes(fileExtension)) {
        //     return cb(new Error(`File format not supported. Please upload a .pptx or .pdf file`));
        // }
        req.file = file;
        cb(null, true);
    }
});
module.exports = upload;