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

// router.route('/:formType')
//     .get(recordsController.getRecordsByType)
//     .patch(recordsController.updateRecords)

router.route('/type/:formType/activityid/')
    .get(recordsController.getRecordsByTypeActId)

router.route('/type/:formType/activityid/:activityId')
    .get(recordsController.getRecordsByTypeActId)


router.route('/options')
    .get(recordsController.getRecordsOptions)

//  router.route('/recordsSE')
//     .post(recordsController.postRecordsByTypeRIdSE)


// router.route(`/records/formtype/:formtype/eid/:eid/start/:start/end/:end`)
// .get(recordsController.getRecordsByTypeEIdSE)
// router.route('/:formType/:id')
//     .get(recordsController.getRecordById)
module.exports = router