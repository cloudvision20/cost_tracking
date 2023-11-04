const Type = require('../models/Type')
// const Note = require('../models/DailyReport')
const bcrypt = require('bcrypt')

// @desc Get all types
// @route GET /types
// @access Private
const getAllTypes = async (req, res) => {
    // Get all types from MongoDB
    const types = await Type.find().lean()

    // If no types 
    if (!types?.length) {
        return res.status(400).json({ message: 'No types found' })
    }
    res.status(200).json(types)
}

// // @desc Update a type
// // @route PATCH /types
// // @access Private
const updateTypes = async (req, res) => {
    const newData = req.body.data
    const response = []
    const data = []
    let type
    let newType
    for (let i = 0; i < newData.length; i++) {
        type = {}
        let id = newData[i].id ? newData[i].id
            : newData[i]._id ? newData[i]._id.toString()
                : undefined

        if (newData[i].category !== undefined) { type.category = newData[i].category }
        if (newData[i].name !== undefined) { type.name = newData[i].name }
        if (newData[i].remarks !== undefined) { type.remarks = newData[i].remarks }
        if (newData[i].active) {
            type.active = newData[i].active
        }


        if (id) {
            // Update
            type._id = id
            await Type.findOneAndUpdate({ _id: id }, type, { new: true }).then((result) => {
                if (result === null) {
                    response.push({ message: `Type Id: ${id} not found update failed` })
                } else {
                    response.push({ message: `Type Id: ${result._id} updated successfully` })
                    data.push(result)
                }
            }).catch((error) => {
                response.push({ message: `error -- Type Id: (\'${id}\') update failed , error: ${error}` })
            });
        } else {
            //create 
            await Type.create(type)
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Type: ${type.name}, fail to create new type` })
                    } else {
                        response.push({ message: `Type Id: ${result._id} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`Type: ${type.name}, error=${error}`)
                        response.push({ message: `error -- Type: ${type.name} create failed , error: ${error}` })
                    }
                )
        }
    }
    return res.status(202).json({ data: data, response })
}


// @desc Delete a type
// @route DELETE /types
// @access Private
const deleteType = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Type ID Required' })
    }

    try {
        const data = await Type.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Type Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `Type Id: (\'${data._id}\'), Type: (\'${data.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Type Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllTypes,
    updateTypes,
    deleteType
}