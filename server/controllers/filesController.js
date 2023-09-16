const uploadFile = require("../middleware/fileUtil");
const fs = require("fs");
const { filePath, baseUrl } = require('../config/filePath')

const getPath = (req, res) => {
    let directoryPath = __basedir + filePath;
    let base_Url = ''
    if (req.path.length > 1) {
        console.log(req.path.substring(1, req.path.length))
        let tempPath = directoryPath + req.path.substring(1, req.path.length)
        directoryPath = tempPath + '/'
        if (!fs.existsSync(tempPath)) {
            fs.mkdir(tempPath,
                { recursive: true }, (err) => {
                    if (err) {
                        fs.mkdir(tempPath,
                            { recursive: true }, (err) => {
                                if (err) {
                                    return console.error(err);
                                }
                                console.log('Directory created successfully!');
                            });
                    }
                    console.log('Directory created successfully!');
                });
        }
        base_Url = baseUrl + req.path.substring(1, req.path.length) + '/'
    } else {
        base_Url = baseUrl
    }
    req.base_Url = base_Url
    req.directoryPath = directoryPath
}

const getFileInfos = (req, res, files) => {
    let fileInfos = [];
    files.forEach((file) => {
        if (file.isFile()) {
            let ext = ""
            switch (req.path) {
                case '/attendances':
                    ext = 'csv'
                    break;
                case '/gpsdat':
                    ext = 'csv'
                    break;
                default:
                    ext = 'any'
                    break;
            }
            if ((file.name.split('.').pop() == ext) || (ext == 'any')) {
                fileInfos.push({
                    name: file.name,
                    url: req.base_Url + file.name,
                });
            }
        }

    });
    return fileInfos
}

const upload = async (req, res) => {
    req.filePath = filePath
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a file!",
                status: "fail"
            });
        }

        getPath(req, res)
        fs.readdir(req.directoryPath, { withFileTypes: true }, function (err, files) {
            let fileInfos = []
            if (err) {
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname + " however Unable to scan files!",
                    fileInfos: fileInfos,
                    status: "success"
                });
            } else {
                fileInfos = getFileInfos(req, res, files)
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                    fileInfos: fileInfos,
                    status: "success"
                });
            }
        });

    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
                status: "fail"
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            status: "fail"
        });
    }
};

const getListFiles = async (req, res) => {
    getPath(req, res)
    fs.readdir(req.directoryPath, { withFileTypes: true }, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        } else {
            const fileInfos = getFileInfos(req, res, files)
            res.status(200).send(fileInfos);
        }
    });
}

const download = (req, res) => {
    getPath(req, res)
    //let fileInfos = [];
    //let base_Url = req.base_Url
    let directoryPath = req.directoryPath
    const fileName = req.params.name;
    //const directoryPath = __basedir + file_Path;

    res.download(directoryPath, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

const remove = (req, res) => {
    getPath(req, res)
    // let fileInfos = [];
    // let base_Url = req.base_Url
    let directoryPath = req.directoryPath
    const fileName = req.params.name;
    //const directoryPath = __basedir + filePath;

    fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete the file. " + err,
            });
        }

        res.status(200).send({
            message: "File is deleted.",
        });
    });
};

const removeSync = (req, res) => {
    const fileName = req.params.name;
    // if (req.path.length > 1) {
    //     filePath = filePath + req.path.substring(1, req.path.length) + '/'
    // }
    // const directoryPath = __basedir + filePath;
    getPath(req, res)
    // let fileInfos = [];
    // let base_Url = req.base_Url
    let directoryPath = req.directoryPath
    try {
        fs.unlinkSync(directoryPath + fileName);

        res.status(200).send({
            message: "File is deleted.",
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete the file. " + err,
        });
    }
};

module.exports = {
    upload,
    getListFiles,
    download,
    remove,
    removeSync,
};
