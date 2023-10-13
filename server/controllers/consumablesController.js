const Consumable = require('../models/Consumable')
// const Note = require('../models/DailyReport')
const bcrypt = require('bcrypt')

// @desc Get all consumables
// @route GET /consumables
// @access Private
const getAllConsumables = async (req, res) => {
    // Get all consumables from MongoDB
    const consumables = await Consumable.find().lean()

    // If no consumables 
    if (!consumables?.length) {
        return res.status(400).json({ message: 'No consumables found' })
    }

    res.json(consumables)
}

// @desc Create new consumable
// @route POST /consumables
// @access Private
const createNewConsumable = async (req, res) => {
    const { name, type, capacity } = req.body

    // Confirm data
    if (!name) {
        return res.status(400).json({ message: 'name is required' })
    }

    // Check for duplicate name
    const duplicate = await Consumable.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate consumable' })
    }


    const consumableObject = {}

    consumableObject.name = name
    consumableObject.type = type
    consumableObject.capacity = capacity

    // Create and store new consumable 
    const consumable = await Consumable.create(consumableObject)

    if (consumable) { //created 
        res.status(201).json({ message: `New consumable ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid consumable data received' })
    }
}

// @desc Update a consumable
// @route PATCH /consumables
// @access Private
const saveConsumable = async (req, res) => {
    const { id, name, type, capacity } = req.body

    // Confirm data 
    if (!name) {
        return res.status(400).json({ message: 'name required' })
    }

    // Does the consumable exist to update?
    const consumable = await Consumable.findById(id).exec()

    if (!consumable) {
        return res.status(400).json({ message: 'Consumable not found' })
    }

    // Check for duplicate 
    const duplicate = await Consumable.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original consumable 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    consumable.name = name
    consumable.type = type
    consumable.capacity = capacity


    const updatedConsumable = await consumable.save()

    res.json({ message: `${updatedConsumable.name} updated` })
}

// @desc Update a consumable
// @route PATCH /consumables
// @access Private
const updateConsumable = async (req, res) => {
    const { name, type, capacity } = req.body

    let id
    req.body.id ? id = req.body.id
        : req.body._id ? id = req.body._id
            : id = undefined
    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'Consumable Id is required' })
    }

    // Does the consumable exist to update?
    const consumableFound = await Consumable.findById(id).exec()

    if (!consumableFound) {
        return res.status(400).json({ message: 'Consumable not found' })
    }

    // Check for duplicate 
    const duplicate = await Consumable.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original consumable 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }
    let consumable = {}
    if (name) { consumable.name = name }
    if (type) { consumable.type = type }
    if (capacity) { consumable.capacity = capacity }

    await Consumable.findOneAndUpdate({ _id: id }, consumable, { new: true }).then((data) => {
        if (data === null) {
            throw new Error(`Consumable Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Consumable Id: (\'${data._id}\'), Name: (\'${data.name}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Consumable Id: (\'${id}\') update failed`, error: error })
    });
}

const updateConsumables = async (req, res) => {
    const newData = req.body.data
    let response = []
    let consumable
    let result

    newData.forEach(async (data) => {
        consumable = new Consumable()


        if (data.name) { consumable.name = data.name }
        if (data.type) { consumable.type = data.type }
        if (data.capacity) { consumable.capacity = parseFloat(data.capacity) }
        if (data._id) {
            consumable._id = data._id
            await Consumable.findOneAndUpdate({ _id: data._id }, consumable, { new: true }).then((data) => {
                if (data === null) {
                    response.push({ message: `Consumable Id: : ${data._id},name: ${data.name} not found update failed` })
                } else {
                    response.push({ message: `Consumable Id: ${data._id},name: ${data.name} updated successfully` })
                }
            }).catch((error) => {
                response.push({ message: `error -- Consumable Id: (\'${data._id}\') update failed , error: ${error}` })
            });
        } else {
            delete (data['_id'])
            await consumable.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Consumable Id: ${data._id},name: ${data.name} fail to saved` })
                    } else {
                        response.push({ message: `Consumable Id: ${data._id},name: ${data.name} created successfully` })
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`result=${result}`)
                        console.log(`id: ${data._id},name: ${data.name}` + error)
                        response.push({ message: `error -- Consumable Id: (\'${data._id}\') create failed , error: ${error}` })
                    }
                )
        }
    }

    )
    console.log(`response = ${JSON.stringify(response)}`)
    res.json(response)
}
// @desc Delete a consumable
// @route DELETE /consumables
// @access Private
const deleteConsumable = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Consumable ID Required' })
    }

    try {
        const consumable = await Consumable.findOneAndDelete({ _id: id });
        if (!consumable) {
            return res.status(400).json({ message: `Consumable Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `Consumable Id: (\'${consumable._id}\'), Name: (\'${consumable.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Consumable Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllConsumables,
    createNewConsumable,
    saveConsumable,
    updateConsumables,
    deleteConsumable
}