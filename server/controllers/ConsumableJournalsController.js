const ConsumableJournal = require('../models/ConsumableJournal')
const User = require('../models/User')
const Activity = require('../models/Activity')
const DailyReport = require('../models/DailyReport')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { format } = require('date-fns')


// @desc Get all consumableJournals
// @route GET /consumableJournals
// @access Private
const getAllConsumableJournals = asyncHandler(async (req, res) => {
    // Get all consumableJournals from MongoDB
    const consumableJournals = await ConsumableJournal.find().populate({ path: 'userId' }).exec()
    // If no consumableJournals 
    if (!consumableJournals?.length) {
        return res.status(400).json({ message: 'No consumableJournals found' })
    }
    res.json(consumableJournals)
})

const getConsumableJournalById = asyncHandler(async (req, res) => {
    const _id = req.params.id
    // Get consumableJournal by Id and return all the data for the options

    // retrieve ConsumableJournal by Id and include usename corresponsing to userId
    let consumableJournal = await ConsumableJournal.find({ "_id": _id }).populate({ path: 'userId' }).exec()
    let activities

    // If no consumableJournal 
    if (!consumableJournal?.length) {
        return res.status(400).json({ message: `ConsumableJournal id: ${_id} not found` })
    } else {
        // options
        activities = await (Activity.find({ "resources.type": "Labour" }).find({ "resources.assignment.resourcesId": "emp001" })).exec()
        //users = (await User.find().select("_id, username"))
        //dailyReports = await DailyReport.find({ "consumableJournalId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.consumableJournal = consumableJournal
    response.activities = activities

    res.json(response)
})


const getConsumableJournalByActivityId = asyncHandler(async (req, res) => {
    const _id = req.params.id
    // Get consumableJournal by Id and return all the data for the options

    // retrieve ConsumableJournal by Id and include usename corresponsing to userId
    let consumableJournal = await ConsumableJournal.find({ "_id": _id }).populate({ path: 'userId' }).exec()
    let activities

    // If no consumableJournal 
    if (!consumableJournal?.length) {
        return res.status(400).json({ message: `ConsumableJournal id: ${_id} not found` })
    } else {
        // options
        activities = await (Activity.find({ "resources.type": "Labour" }).find({ "resources.assignment.resourcesId": "emp001" })).exec()
        //users = (await User.find().select("_id, username"))
        //dailyReports = await DailyReport.find({ "consumableJournalId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.consumableJournal = consumableJournal
    response.activities = activities

    res.json(response)
})
// @desc Create new consumableJournal
// @route POST /consumableJournals
// @access Private
const createNewConsumableJournal = asyncHandler(async (req, res) => {
    const { name } = req.body
    // // Confirm data validation
    // if (!name || !password || !Array.isArray(roles) || !roles.length) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    // Check for duplicate name
    const duplicate = await ConsumableJournal.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // Create and store new consumableJournal 
    const consumableJournal = await ConsumableJournal.create(req.body)

    if (consumableJournal) { //created 
        res.status(201).json({ message: `New consumableJournal ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid consumableJournal data received' })
    }
})

// @desc Update a consumableJournal
// @route PATCH /consumableJournals
// @access Private
const updateConsumableJournal = asyncHandler(async (req, res) => {
    const _id = req.body._id

    // Does the consumableJournal exists for update?
    const consumableJournal = await ConsumableJournal.findById(_id).exec()

    if (!consumableJournal) {
        return res.status(400).json({ message: 'ConsumableJournal not found' })
    }

    consumableJournal.userId = req.body.userId
    consumableJournal.name = req.body.name
    consumableJournal.description = req.body.description
    consumableJournal.startDate = req.body.startDate//format(Date(req.body.startDate), 'yyyy-MM-dd') + 'T23:59:59.999Z' //Date(req.body.startDate)
    consumableJournal.endDate = req.body.endDate//format(Date(req.body.endDate), 'yyyy-MM-dd') + 'T23:59:59.999Z'
    consumableJournal.process = req.body.process
    consumableJournal.duration = req.body.duration
    consumableJournal.resources = req.body.resources
    consumableJournal.completed = req.body.completed
    consumableJournal.workProgress = req.body.workProgress

    const updatedConsumableJournal = await consumableJournal.save()

    res.json({ message: `${updatedConsumableJournal.name} updated` })
})

// @desc Delete a consumableJournal
// @route DELETE /consumableJournals
// @access Private
const deleteConsumableJournal = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data -- check if id is  available
    if (!id) {
        return res.status(400).json({ message: 'ConsumableJournal ID Required' })
    }

    // // Does the consumableJournal still have assigned notes?
    // const note = await Note.findOne({ consumableJournal: id }).lean().exec()
    // if (note) {
    //     return res.status(400).json({ message: 'ConsumableJournal has assigned notes' })
    // }

    // Does the consumableJournal exists for delete?
    const consumableJournal = await ConsumableJournal.findById(id).exec()

    if (!consumableJournal) {
        return res.status(400).json({ message: 'ConsumableJournal not found' })
    }

    const result = await consumableJournal.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllConsumableJournals,
    getConsumableJournalById,
    createNewConsumableJournal,
    updateConsumableJournal,
    deleteConsumableJournal
}