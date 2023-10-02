const Consumable = require('../models/Consumable')
const User = require('../models/User')
const Activity = require('../models/Activity')
const DailyReport = require('../models/DailyReport')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { format } = require('date-fns')


// @desc Get all consumables
// @route GET /consumables
// @access Private
const getAllConsumables = asyncHandler(async (req, res) => {
    // Get all consumables from MongoDB
    const consumables = await Consumable.find().populate({ path: 'userId' }).exec()
    // If no consumables 
    if (!consumables?.length) {
        return res.status(400).json({ message: 'No consumables found' })
    }
    res.json(consumables)
})

const getConsumableById = asyncHandler(async (req, res) => {
    const _id = req.params.id
    // Get consumable by Id and return all the data for the options

    // retrieve Consumable by Id and include usename corresponsing to userId
    let consumable = await Consumable.find({ "_id": _id }).populate({ path: 'userId' }).exec()
    let activities

    // If no consumable 
    if (!consumable?.length) {
        return res.status(400).json({ message: `Consumable id: ${_id} not found` })
    } else {
        // options
        activities = await Activity.find().lean()
        //users = (await User.find().select("_id, username"))
        //dailyReports = await DailyReport.find({ "consumableId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.consumable = consumable
    response.activities = activities

    res.json(response)
})

// @desc Create new consumable
// @route POST /consumables
// @access Private
const createNewConsumable = asyncHandler(async (req, res) => {
    const { name } = req.body
    // // Confirm data validation
    // if (!name || !password || !Array.isArray(roles) || !roles.length) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    // Check for duplicate name
    const duplicate = await Consumable.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // Create and store new consumable 
    const consumable = await Consumable.create(req.body)

    if (consumable) { //created 
        res.status(201).json({ message: `New consumable ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid consumable data received' })
    }
})

// @desc Update a consumable
// @route PATCH /consumables
// @access Private
const updateConsumable = asyncHandler(async (req, res) => {
    const _id = req.body._id

    // Does the consumable exists for update?
    const consumable = await Consumable.findById(_id).exec()

    if (!consumable) {
        return res.status(400).json({ message: 'Consumable not found' })
    }

    consumable.userId = req.body.userId
    consumable.name = req.body.name
    consumable.description = req.body.description
    consumable.startDate = req.body.startDate//format(Date(req.body.startDate), 'yyyy-MM-dd') + 'T23:59:59.999Z' //Date(req.body.startDate)
    consumable.endDate = req.body.endDate//format(Date(req.body.endDate), 'yyyy-MM-dd') + 'T23:59:59.999Z'
    consumable.process = req.body.process
    consumable.duration = req.body.duration
    consumable.resources = req.body.resources
    consumable.completed = req.body.completed
    consumable.workProgress = req.body.workProgress

    const updatedConsumable = await consumable.save()

    res.json({ message: `${updatedConsumable.name} updated` })
})

// @desc Delete a consumable
// @route DELETE /consumables
// @access Private
const deleteConsumable = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data -- check if id is  available
    if (!id) {
        return res.status(400).json({ message: 'Consumable ID Required' })
    }

    // // Does the consumable still have assigned notes?
    // const note = await Note.findOne({ consumable: id }).lean().exec()
    // if (note) {
    //     return res.status(400).json({ message: 'Consumable has assigned notes' })
    // }

    // Does the consumable exists for delete?
    const consumable = await Consumable.findById(id).exec()

    if (!consumable) {
        return res.status(400).json({ message: 'Consumable not found' })
    }

    const result = await consumable.deleteOne()

    const reply = `Name ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllConsumables,
    getConsumableById,
    createNewConsumable,
    updateConsumable,
    deleteConsumable
}