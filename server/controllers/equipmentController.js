const Equip = require('../models/Equipment')

// @desc Get all equipment
// @route GET /equipment
// @access Private
const getAllEquipment = async (req, res) => {
    // Get all equipment from MongoDB
    const equipment = await Equip.find().lean()

    // If no equipment 
    if (!equipment?.length) {
        return res.status(400).json({ message: 'No equipment found' })
    }

    res.status(200).json(equipment)
}

// @desc Create new equip
// @route POST /equipment
// @access Private
const createNewEquip = async (req, res) => {
    const { name, type, capacity } = req.body

    // Confirm data
    if (!name) {
        return res.status(400).json({ message: 'name is required' })
    }

    // Check for duplicate name
    const duplicate = await Equip.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate equip' })
    }

    const equip = {}

    if (name) { equip.name = name }
    if (type) { equip.type = type }
    if (capacity) { equip.capacity = parseFloat(capacity) }

    // Create and store new equip 
    const result = await Equip.create(equip)

    if (result) { //created 
        res.status(201).json({ message: `New equip ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid equip data received' })
    }
}

// @desc Update a equip
// @route PATCH /equipment
// @access Private
const saveEquip = async (req, res) => {
    const { id, name, type, capacity } = req.body

    // Confirm data 
    if (!name) {
        return res.status(400).json({ message: 'name required' })
    }

    // Does the equip exist to update?
    const equip = await Equip.findById(id).exec()

    if (!equip) {
        return res.status(400).json({ message: 'Equip not found' })
    }

    // Check for duplicate 
    const duplicate = await Equip.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original equip 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    if (name) { equip.name = name }
    if (type) { equip.type = type }
    if (capacity) { equip.capacity = parseFloat(capacity) }

    const result = await equip.save()

    res.json({ message: `${result.name} updated` })
}

// @desc Update a equip
// @route PATCH /equipment
// @access Private
const updateEquip = async (req, res) => {
    const { name, type, capacity } = req.body

    let id
    req.body.id ? id = req.body.id
        : req.body._id ? id = req.body._id
            : id = undefined
    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'Equipment Id is required' })
    }

    // Does the equip exist to update?
    const equipFound = await Equip.findById(id).exec()

    if (!equipFound) {
        return res.status(400).json({ message: 'Equip not found' })
    }

    // Check for duplicate 
    const duplicate = await Equip.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original equip 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }
    let equip = {}
    if (name) { equip.name = name }
    if (type) { equip.type = type }
    if (capacity) { equip.capacity = parseFloat(capacity) }

    await Equip.findOneAndUpdate({ _id: id }, equip, { new: true }).then((result) => {
        if (result === null) {
            throw new Error(`Equipment Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Equipment Id: (\'${result._id}\'), Name: (\'${result.name}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Equipment Id: (\'${id}\') update failed`, error: error })
    });
}

const updateEquipment = async (req, res) => {
    const newData = req.body.data
    const response = []
    const data = []
    let equip
    for (let i = 0; i < newData.length; i++) {
        equip = new Equip()
        if (newData[i].name) { equip.name = newData[i].name }
        if (newData[i].type) { equip.type = newData[i].type }
        if (newData[i].capacity) { equip.capacity = parseFloat(newData[i].capacity) }
        if (newData[i]._id) {
            // Update
            equip._id = newData[i]._id
            await Equip.findOneAndUpdate({ _id: newData[i]._id }, equip, { new: true }).then((result) => {
                if (result === null) {
                    response.push({ message: `Equipment Id: ${newData[i]._id},name: ${newData[i].name} not found update failed` })
                } else {
                    response.push({ message: `Equipment Id: ${result._id},name: ${result.name} updated successfully` })
                    data.push(result)
                }
            }).catch((error) => {
                response.push({ message: `error -- Equipment Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
            });
        } else {
            //create 
            await equip.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Equipment Id: ${newData[i]._id},name: ${newData[i].name} fail to saved` })
                    } else {
                        response.push({ message: `Equipment Id: ${result._id},name: ${result.name} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`result=${result}`)
                        console.log(`id: ${newData[i]._id},name: ${newData[i].name}` + error)
                        response.push({ message: `error -- Equipment Id: (\'${data._id}\') create failed , error: ${error}` })
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
// @desc Delete a equip
// @route DELETE /equipment
// @access Private
const deleteEquip = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Equipment Id Required' })
    }

    try {
        const data = await Equip.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Equipment Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ data: data, message: `Equipment Id: (\'${data._id}\'), Name: (\'${data.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Equipment Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllEquipment,
    createNewEquip,
    saveEquip,
    updateEquipment,
    deleteEquip
}