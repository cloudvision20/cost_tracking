const express = require('express')
const router = express.Router()
const activitiesController = require('../controllers/activitiesController')

router.route('/')
    .get(activitiesController.getAllActivities)
    .post(activitiesController.createNewActivity)
    .patch(activitiesController.updateActivity)
    .delete(activitiesController.deleteActivity)

// router.route('/forms/:type')
//     .get(activitiesController.getActivityByType)

router.route('/actsbyprojs')
    .get(activitiesController.getActivitiesByProjs)

router.route('/:id')
    .get(activitiesController.getActivityById)

router.route('/userid/:id')
    .get(activitiesController.getActivityByUserId)

module.exports = router