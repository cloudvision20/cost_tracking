const DailyReport = require('../models/DailyReport')
const User = require('../models/User')

// @desc Get all dailyReports 
// @route GET /dailyReports
// @access Private
const getAllDailyReports = async (req, res) => {
    // Get all dailyReports from MongoDB
    const dailyReports = await DailyReport.find().lean()

    // If no dailyReports 
    if (!dailyReports?.length) {
        return res.status(400).json({ message: 'No dailyReports found' })
    }

    // Add username to each dailyReport before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const dailyReportsWithUser = await Promise.all(dailyReports.map(async (dailyReport) => {
        const user = await User.findById(dailyReport.user).lean().exec()
        return { ...dailyReport, username: user.username }
    }))

    res.json(dailyReportsWithUser)
}

// @desc Create new dailyReport
// @route POST /dailyReports
// @access Private
const createNewDailyReport = async (req, res) => {
    const { user, title, text } = req.body

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await DailyReport.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate dailyReport title' })
    }

    // Create and store the new user 
    const dailyReport = await DailyReport.create({ user, title, text })

    if (dailyReport) { // Created 
        return res.status(201).json({ message: 'New dailyReport created' })
    } else {
        return res.status(400).json({ message: 'Invalid dailyReport data received' })
    }

}

// @desc Update a dailyReport
// @route PATCH /dailyReports
// @access Private
const updateDailyReport = async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm dailyReport exists to update
    const dailyReport = await DailyReport.findById(id).exec()

    if (!dailyReport) {
        return res.status(400).json({ message: 'DailyReport not found' })
    }

    // Check for duplicate title
    const duplicate = await DailyReport.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original dailyReport 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate dailyReport title' })
    }

    dailyReport.user = user
    dailyReport.title = title
    dailyReport.text = text
    dailyReport.completed = completed

    const updatedDailyReport = await dailyReport.save()

    res.json(`'${updatedDailyReport.title}' updated`)
}

// @desc Delete a dailyReport
// @route DELETE /dailyReports
// @access Private
const deleteDailyReport = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'DailyReport ID required' })
    }

    // Confirm dailyReport exists to delete 
    const dailyReport = await DailyReport.findById(id).exec()

    if (!dailyReport) {
        return res.status(400).json({ message: 'DailyReport not found' })
    }

    const result = await dailyReport.deleteOne()

    const reply = `DailyReport '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllDailyReports,
    createNewDailyReport,
    updateDailyReport,
    deleteDailyReport
}