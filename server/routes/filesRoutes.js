const express = require('express')
const router = express.Router()
const filesController = require('../controllers/filesController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(filesController.getListFiles)
    .post(filesController.upload)

router.route('/attendances')
    .get(filesController.getListFiles)
    .post(filesController.upload)

router.route('/attendances/:name')
    .get(filesController.download)
    .delete(filesController.remove)

router.route('/gpsdats')
    .get(filesController.getListFiles)
    .post(filesController.upload)

router.route('/gpsdats/:name')
    .get(filesController.download)
    .delete(filesController.remove)

router.route('/:name')
    .get(filesController.download)
    .delete(filesController.remove)

module.exports = router
