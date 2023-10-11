const Activity = require('../models/Activity')
const User = require('../models/User')
const Project = require('../models/Project')
const DailyReport = require('../models/DailyReport')
const Equipment = require('../models/Equipment')
const Consumable = require('../models/Consumable')
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
    const id = req.params.id
    // retrieve Activity by Id and include usename corresponsing to userId
    let activity = await Activity.find({ "_id": id }).populate({ path: 'userId', select: 'username' }).populate({ path: 'projectId' }).exec()
    let projects
    let users
    let equipment
    let consumables
    let dailyReports

    // If no activity 
    if (!activity?.length) {
        return res.status(400).json({ message: `Activity id: ${id} not found` })
    } else {
        // options
        projects = await Project.find().lean()
        users = (await User.find().select("_id, username"))
        equipment = (await Equipment.find().select("_id, name"))
        consumables = (await Consumable.find().select("_id, name"))
        dailyReports = await DailyReport.find({ "activityId": id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.activity = activity
    response.projects = projects
    response.users = users
    response.dailyReports = dailyReports
    response.equipment = equipment
    response.consumables = consumables
    res.json(response)
})

const getActivityByUserId = asyncHandler(async (req, res) => {
    const id = req.params.id
    let activities = await (Activity.find({ "resources.type": "Labour" }).find({ "resources.assignment.resourcesId": id })).exec()
    res.json(activities)
})


// @desc Create new activity
// @route POST /activities
// @access Private
const createNewActivity = asyncHandler(async (req, res) => {
    const { name } = req.body

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
    let id = req.body.id ? req.body.id
        : req.body._id ? req.body._id
            : undefined

    // Does the activity exists for update?
    let activity = await Activity.findById(id).exec()

    if (!activity) {
        return res.status(400).json({ message: 'Activity not found' })
    }

    await Activity.findOneAndUpdate({ _id: id }, req.body, { new: true }).then((data) => {
        if (data === null) {
            throw new Error(`Activity Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Activity Id: (\'${data._id}\'), Activity (name: \'${data.name}\') updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Activity Id: (\'${id}\') update failed`, error: error })
    });
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

    try {
        const data = await Activity.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Activity Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `Activity Id: (\'${data._id}\'), name: (\'${data.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Activity Id: (\'${id}\') delete failed`, error: err })
    }
})

module.exports = {
    getAllActivities,
    getActivityById,
    getActivityByUserId,
    createNewActivity,
    updateActivity,
    deleteActivity
}