const express = require('express')
const router = express.Router()
const crviewController = require('../controllers/crviewController')


router.route('/actsbyprojs/:startDate/:endDate')
    .get(crviewController.getActivitiesByProjs)

router.route('/employeeSE')
    .post(crviewController.postHrsByEIdSE)

module.exports = router