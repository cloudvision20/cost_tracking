const Equipment = require('../models/Equipment')
const Consumable = require('../models/Consumable')
const Expense = require('../models/Expense')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all masters
// @route GET /masters
// @access Private
const getAllMastersByType = asyncHandler(async (req, res) => {
    const formType = req.params.type

    let response = {}
    if (formType === 'Consumables') {
        await Consumable.find().lean().then((result) => {
            if (result === null) {
                console.log(`${formType} master not found`)
            }
            console.log('result =' + JSON.stringify(result))
            response.masters = result
        }).catch((error => {
            console.log(`error : ${formType} Loading Error`)
        }))

    } else if (formType === 'Equipment') {
        await Equipment.find().lean().then((result) => {
            if (result === null) {
                console.log(`${formType} master not found`)
            }
            console.log('result =' + JSON.stringify(result))
            response.masters = result
        }).catch((error => {
            console.log(`error : ${formType} Loading Error`)
        }))

    } else if (formType === 'Expenses') {
        await Expense.find().lean().then((result) => {
            if (result === null) {
                console.log(`${formType} master not found`)
            }
            console.log('result =' + JSON.stringify(result))
            response.masters = result
        }).catch((error => {
            console.log(`error : ${formType} Loading Error`)
        }))
    }

    console.log('response =' + JSON.stringify(response))
    res.status(200).json(response)
})
// @desc Create new master
// // @route POST /masters
// // @access Private
// const NewMasterByType = async (req, res) => {

//     const formType = req.params.type
//     const { name, type, unit, capacity } = req.body

//     // Confirm data
//     if (!name) {
//         return res.status(400).json({ message: 'name is required' })
//     }

//     // Check for duplicate name
//     const duplicate = await Master.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

//     if (duplicate) {
//         return res.status(409).json({ message: 'Duplicate master' })
//     }

//     const master = {}

//     if (name) { master.name = name }
//     if (type) { master.type = type }
//     if (capacity) { master.capacity = parseFloat(capacity) }
//     if (unit) { master.unit = unit }

//     // Create and store new master 
//     const result = await Master.create(master)

//     if (result) { //created 
//         res.status(201).json({ message: `New master ${name} created` })
//     } else {
//         res.status(400).json({ message: 'Invalid master data received' })
//     }
// }

// @desc Update a master
// // @route PATCH /masters
// // @access Private
// const saveMaster = async (req, res) => {
//     const { id, name, type, unit, capacity, remark } = req.body

//     // Confirm data 
//     if (!name) {
//         return res.status(400).json({ message: 'name required' })
//     }

//     // Does the master exist to update?
//     const master = await Master.findById(id).exec()

//     if (!master) {
//         return res.status(400).json({ message: 'Master not found' })
//     }

//     // Check for duplicate 
//     const duplicate = await Master.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

//     // Allow updates to the original master 
//     if (duplicate && duplicate?._id.toString() !== id) {
//         return res.status(409).json({ message: 'Duplicate name' })
//     }

//     if (name) { master.name = name }
//     if (type) { master.type = type }
//     if (capacity) { master.capacity = parseFloat(capacity) }
//     if (unit) { master.unit = unit }
//     if (remark) { master.remark = remark }

//     const result = await master.save()

//     res.json({ message: `${result.name} updated` })
// }

// // @desc Update a master
// // @route PATCH /masters
// // @access Private
// const updateMaster = async (req, res) => {
//     const { name, type, unit, capacity, remark } = req.body

//     let id
//     req.body.id ? id = req.body.id
//         : req.body._id ? id = req.body._id
//             : id = undefined
//     // Confirm data 
//     if (!id) {
//         return res.status(400).json({ message: 'Master Id is required' })
//     }

//     // Does the master exist to update?
//     const masterFound = await Master.findById(id).exec()

//     if (!masterFound) {
//         return res.status(400).json({ message: 'Master not found' })
//     }

//     // Check for duplicate 
//     const duplicate = await Master.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

//     // Allow updates to the original master 
//     if (duplicate && duplicate?._id.toString() !== id) {
//         return res.status(409).json({ message: 'Duplicate name' })
//     }
//     let master = {}
//     if (name) { master.name = name }
//     if (type) { master.type = type }
//     if (capacity) { master.capacity = parseFloat(capacity) }
//     if (unit) { master.unit = unit }
//     if (remark) { master.remark = remark }


//     await Master.findOneAndUpdate({ _id: id }, master, { new: true }).then((result) => {
//         if (result === null) {
//             throw new Error(`Master Id: (\'${id}\') not found update failed `);
//         }
//         res.json({ message: `Master Id: (\'${result._id}\'), Name: (\'${result.name}\'), updated successfully` })
//     }).catch((error) => {

//         res.status(500).json({ message: `error -- Master Id: (\'${id}\') update failed`, error: error })
//     });
// }

const updateMasters = async (req, res) => {
    const newData = req.body.data
    const formType = req.body.formType
    //const formName = !formType ? 'Master' : formType
    const response = []
    const data = []
    let master
    for (let i = 0; i < newData.length; i++) {
        master = (formType === 'Consumables') ?
            new Consumable()
            : (formType === 'Equipment') ?
                new Equipment()
                : (formType === 'Expenses') ?
                    new Expense()
                    : {}

        master.name = newData[i].name ? newData[i].name : null
        master.type = newData[i].type ? newData[i].type : null
        master.capacity = newData[i].capacity ? parseFloat(newData[i].capacity) : null
        master.unit = newData[i].unit ? newData[i].unit : null
        master.remark = newData[i].remark ? newData[i].remark : null

        if (newData[i]._id) {
            // Update
            master._id = newData[i]._id
            switch (formType) {
                case 'Consumables':
                    await Consumable.findOneAndUpdate({ _id: newData[i]._id }, master, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formType} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formType} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formType} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
                case 'Equipment':
                    await Equipment.findOneAndUpdate({ _id: newData[i]._id }, master, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formType} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formType} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formType} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
                case 'Expenses':
                    await Expense.findOneAndUpdate({ _id: newData[i]._id }, master, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formType} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formType} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formType} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
                default:
                    await Master.findOneAndUpdate({ _id: newData[i]._id }, master, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formType} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formType} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formType} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
            }

        } else {
            //create 
            await master.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `${formType} Id: ${newData[i]._id},details: ${newData[i].details} fail to saved` })
                    } else {
                        response.push({ message: `${formType} Id: ${result._id},details: ${result.details} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`error=${error}`)
                        console.log(`id: ${newData[i]._id},details: ${newData[i].details}` + error)
                        response.push({ message: `error -- ${formType} Id: (\'${data._id}\') create failed , error: ${error}` })
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
// @desc Delete a master
// @route DELETE /masters
// @access Private
const deleteMaster = async (req, res) => {
    const { id, formType } = req.body.del
    // const formName = !formType ? 'Master' : formType

    if (!formType) { return res.status(400).json({ message: `${formType} ID Required` }) }
    if (!id) { return res.status(400).json({ message: `${formType} ID Required` }) }
    try {
        const data = (formType === 'Consumables') ?
            await Consumable.findOneAndDelete({ _id: id })
            : (formType === 'Equipment') ?
                await Equipment.findOneAndDelete({ _id: id })
                : (formType === 'Expenses') ?
                    await Expense.findOneAndDelete({ _id: id })
                    : await Master.findOneAndDelete({ _id: id });
        //const data = await master.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `${formType}  Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ data: data, message: `${formType}  Id: (\'${data._id}\'), Details: (\'${data.details}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- ${formType}  Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllMastersByType,
    // NewMasterByType,
    // saveMaster,
    updateMasters,
    deleteMaster
}