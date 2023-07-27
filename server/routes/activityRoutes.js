const express = require('express')
const router = express.Router()
const activitysController = require('../controllers/activitiesController')

router.route('/')
    .get(activitysController.getAllActivities)
    .post(activitysController.createNewActivity)
    .patch(activitysController.updateActivity)
    .delete(activitysController.deleteActivity)

module.exports = router