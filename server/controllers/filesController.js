const fs = require("fs");
const { filePath, baseUrl } = require('../config/filePath')
const csv = require('fast-csv');
const mongoose = require('mongoose')
const Attendance = require("../models/Attendance")

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
                case '/gpsdats':
                    ext = 'gpx'
                    break;
                default:
                    ext = 'any'
                    break;
            }
            if ((file.name.split('.').pop().toLowerCase() == ext) || (ext == 'any')) {
                fileInfos.push({
                    name: file.name,
                    url: req.base_Url + file.name,
                });
            }
        }

    });
    return fileInfos
}

const importAttendance = async (file) => {
    let attendances = [];
    fileContent = file.data.toString()
    fileContent = fileContent.replace('Employee No', 'employeeId')
    fileContent = fileContent.replace('Employee Name', 'employeeName')
    fileContent = fileContent.replace('Date', 'date')
    fileContent = fileContent.replace('Weekday', 'weekday')
    fileContent = fileContent.replace('Time', 'time')
    fileContent = fileContent.replace('DateTime', 'datetime')
    fileContent = fileContent.replace('IO Status', 'clockType')
    fileContent = fileContent.replace('Device ID', 'terminal')
    csv.parseString(fileContent, {
        headers: true,
        ignoreEmpty: true
    }).on("data", function (data) {
        data['_id'] = new mongoose.Types.ObjectId();
        data['userId'] = file.userid;

        attendances.push(data);
    }).on("end", function () {
        Attendance.create(attendances, function (err, documents) {
            if (err) throw err;
        });
        console.log(attendances.length + ' attendances transactions have been successfully imported.')
    });
}


const upload = async (req, res) => {
    let uploadPath;
    let results;
    getPath(req, res)
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    let file = req.files.file;
    file.userid = req.body.userid
    switch (req.path) {
        case '/attendances':
            results = await importAttendance(file);
            break;
        case '/gpsdats':
            ext = 'gpx'
            break;
        default:
            ext = 'any'
            break;
    }

    uploadPath = req.directoryPath + file.name
    file.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded to ' + uploadPath);
    });
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
