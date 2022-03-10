const multer = require('multer');
const storage = multer.diskStorage({});
const FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

module.exports = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (FORMATS.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type is not supported'), false);
        }
    }
});