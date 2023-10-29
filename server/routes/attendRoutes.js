const express = require('express')
const router = express.Router()
const attendsController = require('../controllers/attendsController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .patch(attendsController.updateAttends)
    .delete(attendsController.deleteAttend)
    .get(attendsController.getAllAttends)
router.route('/employees')
    .get(attendsController.getEmployeeByAggregate)
router.route('/employee/:eid')
    .get(attendsController.getAllAttendsByEId)
module.exports = router