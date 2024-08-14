const Cash = require('../models/Cash')
const bcrypt = require('bcrypt')

// @desc Get all cashes
// @route GET /cashes
// @access Private
const getAllCashes = async (req, res) => {
    // Get all cashes from MongoDB
    const cashes = await Cash.find().lean()

    // If no cashes 
    if (!cashes?.length) {
        return res.status(400).json({ message: 'No cashes found' })
    }

    res.status(200).json(cashes)
}

// @desc Create new cash
// @route POST /cashes
// @access Private
const createNewCash = async (req, res) => {
    const { name, type, capacity } = req.body

    // Confirm data
    if (!name) {
        return res.status(400).json({ message: 'name is required' })
    }

    // Check for duplicate name
    const duplicate = await Cash.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate cash' })
    }

    const cash = {}

    if (name) { cash.name = name }
    if (type) { cash.type = type }
    if (capacity) { cash.capacity = parseFloat(capacity) }

    // Create and store new cash 
    const result = await Cash.create(cash)

    if (result) { //created 
        res.status(201).json({ message: `New cash ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid cash data received' })
    }
}

// @desc Update a cash
// @route PATCH /cashes
// @access Private
const saveCash = async (req, res) => {
    const { id, name, type, capacity } = req.body

    // Confirm data 
    if (!name) {
        return res.status(400).json({ message: 'name required' })
    }

    // Does the cash exist to update?
    const cash = await Cash.findById(id).exec()

    if (!cash) {
        return res.status(400).json({ message: 'Cash not found' })
    }

    // Check for duplicate 
    const duplicate = await Cash.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original cash 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    if (name) { cash.name = name }
    if (type) { cash.type = type }
    if (capacity) { cash.capacity = parseFloat(capacity) }

    const result = await cash.save()

    res.json({ message: `${result.name} updated` })
}

// @desc Update a cash
// @route PATCH /cashes
// @access Private
const updateCash = async (req, res) => {
    const { name, type, capacity } = req.body

    let id
    req.body.id ? id = req.body.id
        : req.body._id ? id = req.body._id
            : id = undefined
    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'Cash Id is required' })
    }

    // Does the cash exist to update?
    const cashFound = await Cash.findById(id).exec()

    if (!cashFound) {
        return res.status(400).json({ message: 'Cash not found' })
    }

    // Check for duplicate 
    const duplicate = await Cash.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original cash 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }
    let cash = {}
    if (name) { cash.name = name }
    if (type) { cash.type = type }
    if (capacity) { cash.capacity = parseFloat(capacity) }

    await Cash.findOneAndUpdate({ _id: id }, cash, { new: true }).then((result) => {
        if (result === null) {
            throw new Error(`Cash Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Cash Id: (\'${result._id}\'), Name: (\'${result.name}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Cash Id: (\'${id}\') update failed`, error: error })
    });
}

const updateCashes = async (req, res) => {
    const newData = req.body.data
    const response = []
    const data = []
    let cash
    for (let i = 0; i < newData.length; i++) {
        cash = new Cash()
        if (newData[i].name) { cash.name = newData[i].name }
        if (newData[i].type) { cash.type = newData[i].type }
        if (newData[i].capacity) { cash.capacity = parseFloat(newData[i].capacity) }
        if (newData[i]._id) {
            // Update
            cash._id = newData[i]._id
            await Cash.findOneAndUpdate({ _id: newData[i]._id }, cash, { new: true }).then((result) => {
                if (result === null) {
                    response.push({ message: `Cash Id: : ${newData[i]._id},name: ${newData[i].name} not found update failed` })
                } else {
                    response.push({ message: `Cash Id: ${result._id},name: ${result.name} updated successfully` })
                    data.push(result)
                }
            }).catch((error) => {
                response.push({ message: `error -- Cash Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
            });
        } else {
            //create 
            await cash.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Cash Id: ${newData[i]._id},name: ${newData[i].name} fail to saved` })
                    } else {
                        response.push({ message: `Cash Id: ${result._id},name: ${result.name} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`result=${result}`)
                        console.log(`id: ${newData[i]._id},name: ${newData[i].name}` + error)
                        response.push({ message: `error -- Cash Id: (\'${data._id}\') create failed , error: ${error}` })
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
// @desc Delete a cash
// @route DELETE /cashes
// @access Private
const deleteCash = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Cash ID Required' })
    }

    try {
        const data = await Cash.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Cash Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ data: data, message: `Cash Id: (\'${data._id}\'), Name: (\'${data.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Cash Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllCashes,
    createNewCash,
    saveCash,
    updateCashes,
    deleteCash
}