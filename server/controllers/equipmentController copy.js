const Equip = require('../models/Equipment')
// const Note = require('../models/DailyReport')
const bcrypt = require('bcrypt')

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

    res.json(equipment)
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
        return res.status(409).json({ message: 'Duplicate equipment' })
    }


    const equip = {}

    equip.name = name
    equip.type = type
    equip.capacity = capacity

    // Create and store new equipment 
    const result = await Equip.create(equip)

    if (result) { //created 
        res.status(201).json({ message: `New equipment ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid equipment data received' })
    }
}

// @desc Update a equipment
// @route PATCH /equipment
// @access Private
const saveEquip = async (req, res) => {
    const { id, name, type, capacity } = req.body

    // Confirm data 
    if (!name) {
        return res.status(400).json({ message: 'name required' })
    }

    // Does the equipment exist to update?
    const equip = await Equip.findById(id).exec()

    if (!equip) {
        return res.status(400).json({ message: 'Equipment not found' })
    }

    // Check for duplicate 
    const duplicate = await Equip.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original equipment 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    equip.name = name
    equip.type = type
    equip.capacity = capacity


    const result = await Equip.save()

    res.json({ message: `${result.name} updated` })
}

// @desc Update a equipment
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
        return res.status(400).json({ message: 'equipment Id is required' })
    }

    // Does the equipment exist to update?
    const EquipFound = await Equip.findById(id).exec()

    if (!equipFound) {
        return res.status(400).json({ message: 'equipment not found' })
    }

    // Check for duplicate 
    const duplicate = await Equip.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original equipment 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }
    let equip = {}
    if (name) { equip.name = name }
    if (type) { equip.type = type }
    if (capacity) { equip.capacity = capacity }

    await Equip.findOneAndUpdate({ _id: id }, equip, { new: true }).then((data) => {
        if (data === null) {
            throw new Error(`Equipmment Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Equipmment Id: (\'${data._id}\'), Name: (\'${data.name}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Equipmment Id: (\'${id}\') update failed`, error: error })
    });
}

const updateEquipment = async (req, res) => {
    const newData = req.body.data
    let response = []
    let equip
    let result
    newData.forEach((data) => {
        equip = new Equip()

        if (data._id != '') { equip._id = data._id }
        if (data.name) { equip.name = data.name }
        if (data.type) { equip.type = data.type }
        if (data.capacity) { equip.capacity = data.capacity }

        result = equip.save()
        if (result) {
            response.push({ message: `${data.name} saved` })
        } else {
            response.push({ message: `${data.name} fail to saved` })
        }
    }
    )
    res.json(response)
}
// @desc Delete a equipment
// @route DELETE /equipment
// @access Private
const deleteEquip = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Equipment ID Required' })
    }

    try {
        const result = await Equip.findOneAndDelete({ _id: id });
        if (!result) {
            return res.status(400).json({ message: `Equipment Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `Equipment Id: (\'${result._id}\'), Name: (\'${result.name}\'), deleted successfully` });
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