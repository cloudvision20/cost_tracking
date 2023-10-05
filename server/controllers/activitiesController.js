const Activity = require('../models/Activity')
const User = require('../models/User')
const Project = require('../models/Project')
const DailyReport = require('../models/DailyReport')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { format } = require('date-fns')


// @desc Get all activities
// @route GET /activities
// @access Private
const getAllActivities = asyncHandler(async (req, res) => {
    // Get all activities from MongoDB
    const activities = await Activity.find().lean()
    // If no activities 
    if (!activities?.length) {
        return res.status(400).json({ message: 'No activities found' })
    }
    res.json(activities)
})

const getActivityById = asyncHandler(async (req, res) => {
    const _id = req.params.id
    // Get activity by Id and return all the data for the options

    // retrieve Activity by Id and include usename corresponsing to userId
    let activity = await Activity.find({ "_id": _id }).populate({ path: 'userId', select: 'username' }).populate({ path: 'projectId' }).exec()
    let projects
    let users
    let dailyReports

    // If no activity 
    if (!activity?.length) {
        return res.status(400).json({ message: `Activity id: ${_id} not found` })
    } else {
        // options
        projects = await Project.find().lean()
        users = (await User.find().select("_id, username"))
        dailyReports = await DailyReport.find({ "activityId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.activity = activity
    response.projects = projects
    response.users = users
    response.dailyReports = dailyReports
    res.json(response)
})

const getActivityByUserId = asyncHandler(async (req, res) => {
    const _id = req.params.id
    // Get activity by Id and return all the data for the options

    // retrieve Activity by Id and include usename corresponsing to userId
    //let activity = await Activity.find({ "_id": _id }).populate({ path: 'userId', select: 'username' }).populate({ path: 'projectId' }).exec()
    let activities = await (Activity.find({ "resources.type": "Labour" }).find({ "resources.assignment.resourcesId": req.params.id })).exec()
    // let projects
    // let users
    // let dailyReports

    // If no activity 
    // if (!activity?.length) {
    //     return res.status(400).json({ message: `Activity id: ${_id} not found` })
    // } else {
    //     // options
    //     projects = await Project.find().lean()
    //     users = (await User.find().select("_id, username"))
    //     dailyReports = await DailyReport.find({ "activityId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    //     activities = await (Activity.find({ "resources.type": "Labour" }).find({ "resources.assignment.resourcesId": "emp001" })).exec()
    // }

    // let response = {}

    // response.activity = activity
    // response.projects = projects
    // response.users = users
    // response.dailyReports = dailyReports
    res.json(activities)
})


// @desc Create new activity
// @route POST /activities
// @access Private
const createNewActivity = asyncHandler(async (req, res) => {
    const { name } = req.body
    // // Confirm data validation
    // if (!name || !password || !Array.isArray(roles) || !roles.length) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    // Check for duplicate name
    const duplicate = await Activity.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // Create and store new activity 
    const activity = await Activity.create(req.body)

    if (activity) { //created 
        res.status(201).json({ message: `New activity ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid activity data received' })
    }
})

// @desc Update a activity
// @route PATCH /activities
// @access Private
const updateActivity = asyncHandler(async (req, res) => {
    const _id = req.body._id

    // Does the activity exists for update?
    const activity = await Activity.findById(_id).exec()

    if (!activity) {
        return res.status(400).json({ message: 'Activity not found' })
    }

    activity.userId = req.body.userId
    activity.name = req.body.name
    activity.description = req.body.description
    activity.startDate = req.body.startDate//format(Date(req.body.startDate), 'yyyy-MM-dd') + 'T23:59:59.999Z' //Date(req.body.startDate)
    activity.endDate = req.body.endDate//format(Date(req.body.endDate), 'yyyy-MM-dd') + 'T23:59:59.999Z'
    activity.process = req.body.process
    activity.duration = req.body.duration
    activity.resources = req.body.resources
    activity.completed = req.body.completed
    activity.workProgress = req.body.workProgress

    const updatedActivity = await activity.save()

    res.json({ message: `${updatedActivity.name} updated` })
})

// @desc Delete a activity
// @route DELETE /activities
// @access Private
const deleteActivity = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data -- check if id is  available
    if (!id) {
        return res.status(400).json({ message: 'Activity ID Required' })
    }

    // // Does the activity still have assigned notes?
    // const note = await Note.findOne({ activity: id }).lean().exec()
    // if (note) {
    //     return res.status(400).json({ message: 'Activity has assigned notes' })
    // }

    // Does the activity exists for delete?
    const activity = await Activity.findById(id).exec()

    if (!activity) {
        return res.status(400).json({ message: 'Activity not found' })
    }

    const result = await activity.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllActivities,
    getActivityById,
    getActivityByUserId,
    createNewActivity,
    updateActivity,
    deleteActivity
}