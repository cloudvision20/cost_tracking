const express = require('express')
const router = express.Router()
const dailyReportsController = require('../controllers/dailyReportsController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(dailyReportsController.getAllDailyReports)
    .post(dailyReportsController.createNewDailyReport)
    .patch(dailyReportsController.updateDailyReport)
    .delete(dailyReportsController.deleteDailyReport)

module.exports = router