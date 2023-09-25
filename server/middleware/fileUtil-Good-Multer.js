const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
//const { filePath, baseUrl } = require('../config/filePath')


let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let file_Path = ''
    if (req.path.length > 1) {
      file_Path = req.filePath + req.path.substring(1, req.path.length) + '/'
    } else {
      file_Path = req.filePath
    }
    let directoryPath = __basedir + file_Path
    cb(null, directoryPath);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
