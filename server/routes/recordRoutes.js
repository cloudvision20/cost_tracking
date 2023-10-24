const express = require('express')
const router = express.Router()
const recordsController = require('../controllers/recordsController')


router.route('/')
    .get(recordsController.getAllRecords)
    .post(recordsController.createNewRecord)
    .patch(recordsController.updateRecords)
    .delete(recordsController.deleteRecord)

// router.route('/forms/:type')
//     .get(recordsController.getMastersByType)

router.route('/:formType')
    .get(recordsController.getRecordsByType)
    .patch(recordsController.updateRecords)
// router.route('/:formType/:id')
//     .get(recordsController.getRecordById)
module.exports = router