const Activity = require('../models/Activity')
const Note = require('../models/DailyReport')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

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

// @desc Create new activity
// @route POST /activities
// @access Private
const createNewActivity = asyncHandler(async (req, res) => {
    // const { name, password, roles } = req.body
    const { name } = req.body.activityDetails
    // // Confirm data
    // if (!name || !password || !Array.isArray(roles) || !roles.length) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }


    // Check for duplicate name
    const dup = await Activity.find({ "activityDetails.name": name }).lean().exec()
    const dup0 = await Activity.find({ "activityDetails.duration.unit": "month" }).lean().exec()
    const duplicate = await Activity.findOne({ "activityDetails.name": name }).lean().exec()
    const dup2 = await Activity.find({ "resources.item": "Labour" }).lean().exec()
    const dup3 = await Activity.find().populate(
        {
            path: "activityDetails",
            match: { name: name }
        }
    ).lean().exec()



    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // // Hash password 
    // const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    // const activityObject = { name, "password": hashedPwd, roles }

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
    //const { id, name, roles, active, password } = req.body
    const _id = req.body._id
    const req_body = req.body

    // Confirm data 
    // if (!id || !name || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    //     return res.status(400).json({ message: 'All fields except password are required' })
    // }

    // Does the activity exist to update?
    const activity = await Activity.findById(_id).exec()

    if (!activity) {
        return res.status(400).json({ message: 'Activity not found' })
    }

    // Check for duplicate 
    //const duplicate = await Activity.findOne({ name }).lean().exec()
    const duplicate = await Activity.findOne({ "activityDetails.name": req_body.activityDetails.name }).lean().exec()

    // Allow updates to the original activity 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    activity.activityDetails.name = req_body.activityDetails.name
    activity.completed = req_body.activityDetails.completed

    // if (password) {
    //     // Hash password 
    //     activity.password = await bcrypt.hash(password, 10) // salt rounds 
    // }

    const updatedActivity = await activity.save()

    res.json({ message: `${updatedActivity.activityDetails.name} updated` })
})

// @desc Delete a activity
// @route DELETE /activities
// @access Private
const deleteActivity = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Activity ID Required' })
    }

    // // Does the activity still have assigned notes?
    // const note = await Note.findOne({ activity: id }).lean().exec()
    // if (note) {
    //     return res.status(400).json({ message: 'Activity has assigned notes' })
    // }

    // Does the activity exist to delete?
    const activity = await Activity.findById(id).exec()

    if (!activity) {
        return res.status(400).json({ message: 'Activity not found' })
    }

    const result = await activity.deleteOne()

    const reply = `Name ${result.activityDetails.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllActivities,
    createNewActivity,
    updateActivity,
    deleteActivity
}