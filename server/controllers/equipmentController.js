const Equipment = require('../models/Equipment')
// const Note = require('../models/DailyReport')
const bcrypt = require('bcrypt')

// @desc Get all equipment
// @route GET /equipment
// @access Private
const getAllEquipment = async (req, res) => {
    // Get all equipment from MongoDB
    const equipment = await Equipment.find().lean()

    // If no equipments 
    if (!equipment?.length) {
        return res.status(400).json({ message: 'No equipment found' })
    }

    res.json(equipment)
}

// @desc Create new equipment
// @route POST /equipments
// @access Private
const createNewEquipment = async (req, res) => {
    const { name, type, capacity } = req.body

    // Confirm data
    if (!name) {
        return res.status(400).json({ message: 'name is required' })
    }

    // Check for duplicate name
    const duplicate = await Equipment.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate equipment' })
    }


    const equipmentObject = {}

    equipmentObject.name = name
    equipmentObject.type = type
    equipmentObject.capacity = capacity

    // Create and store new equipment 
    const equipment = await Equipment.create(equipmentObject)

    if (equipment) { //created 
        res.status(201).json({ message: `New equipment ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid equipment data received' })
    }
}

// @desc Update a equipment
// @route PATCH /equipments
// @access Private
const saveEquipment = async (req, res) => {
    const { id, name, type, capacity } = req.body

    // Confirm data 
    if (!name) {
        return res.status(400).json({ message: 'name required' })
    }

    // Does the equipment exist to update?
    const equipment = await Equipment.findById(id).exec()

    if (!equipment) {
        return res.status(400).json({ message: 'Equipment not found' })
    }

    // Check for duplicate 
    const duplicate = await Equipment.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original equipment 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    equipment.name = name
    equipment.type = type
    equipment.capacity = capacity


    const updatedEquipment = await equipment.save()

    res.json({ message: `${updatedEquipment.name} updated` })
}

// @desc Update a equipment
// @route PATCH /equipments
// @access Private
const updateEquipment = async (req, res) => {
    const { name, type, capacity } = req.body

    let id
    req.body.id ? id = req.body.id
        : req.body._id ? id = req.body._id
            : id = undefined
    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'Equipment Id is required' })
    }

    // Does the equipment exist to update?
    const equipmentFound = await Equipment.findById(id).exec()

    if (!equipmentFound) {
        return res.status(400).json({ message: 'Equipment not found' })
    }

    // Check for duplicate 
    const duplicate = await Equipment.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original equipment 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }
    let equipment = {}
    if (name) { equipment.name = name }
    if (type) { equipment.type = type }
    if (capacity) { equipment.capacity = capacity }

    await Equipment.findOneAndUpdate({ _id: id }, equipment, { new: true }).then((data) => {
        if (data === null) {
            throw new Error(`Equipment Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Equipment Id: (\'${data._id}\'), Name: (\'${data.name}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Equipment Id: (\'${id}\') update failed`, error: error })
    });
}

// @desc Delete a equipment
// @route DELETE /equipments
// @access Private
const deleteEquipment = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Equipment ID Required' })
    }

    try {
        const equipment = await Equipment.findOneAndDelete({ _id: id });
        if (!equipment) {
            return res.status(400).json({ message: `Equipment Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `Equipment Id: (\'${data._id}\'), Name: (\'${data.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Equipment Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllEquipment,
    createNewEquipment,
    saveEquipment,
    updateEquipment,
    deleteEquipment
}