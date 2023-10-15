const Consumable = require('../models/Consumable')
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

    res.status(200).json(consumables)
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

    const consumable = {}

    if (name) { consumable.name = name }
    if (type) { consumable.type = type }
    if (capacity) { consumable.capacity = parseFloat(capacity) }

    // Create and store new consumable 
    const result = await Consumable.create(consumable)

    if (result) { //created 
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

    if (name) { consumable.name = name }
    if (type) { consumable.type = type }
    if (capacity) { consumable.capacity = parseFloat(capacity) }

    const result = await consumable.save()

    res.json({ message: `${result.name} updated` })
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
    if (capacity) { consumable.capacity = parseFloat(capacity) }

    await Consumable.findOneAndUpdate({ _id: id }, consumable, { new: true }).then((result) => {
        if (result === null) {
            throw new Error(`Consumable Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Consumable Id: (\'${result._id}\'), Name: (\'${result.name}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Consumable Id: (\'${id}\') update failed`, error: error })
    });
}

const updateConsumables = async (req, res) => {
    const newData = req.body.data
    const response = []
    const data = []
    let consumable
    for (let i = 0; i < newData.length; i++) {
        consumable = new Consumable()
        if (newData[i].name) { consumable.name = newData[i].name }
        if (newData[i].type) { consumable.type = newData[i].type }
        if (newData[i].capacity) { consumable.capacity = parseFloat(newData[i].capacity) }
        if (newData[i]._id) {
            // Update
            consumable._id = newData[i]._id
            await Consumable.findOneAndUpdate({ _id: newData[i]._id }, consumable, { new: true }).then((result) => {
                if (result === null) {
                    response.push({ message: `Consumable Id: : ${newData[i]._id},name: ${newData[i].name} not found update failed` })
                } else {
                    response.push({ message: `Consumable Id: ${result._id},name: ${result.name} updated successfully` })
                    data.push(result)
                }
            }).catch((error) => {
                response.push({ message: `error -- Consumable Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
            });
        } else {
            //create 
            await consumable.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Consumable Id: ${newData[i]._id},name: ${newData[i].name} fail to saved` })
                    } else {
                        response.push({ message: `Consumable Id: ${result._id},name: ${result.name} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`result=${result}`)
                        console.log(`id: ${newData[i]._id},name: ${newData[i].name}` + error)
                        response.push({ message: `error -- Consumable Id: (\'${data._id}\') create failed , error: ${error}` })
                    }
                )
        }
    }
    console.log(`response = ${JSON.stringify(response)}`)
    console.log(`data = ${JSON.stringify(data)}`)
    // let result = {}
    // result.data = data
    // result.response = response

    return res.status(202).json({ data: data, response })
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
        const data = await Consumable.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Consumable Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ data: data, message: `Consumable Id: (\'${data._id}\'), Name: (\'${data.name}\'), deleted successfully` });
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