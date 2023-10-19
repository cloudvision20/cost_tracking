const Record = require('../models/Record')
const ConsJrnl = require('../models/ConsumableJournal')
const Equip = require('../models/EquipmentJournal')
const Expense = require('../models/ExpenseJournal')

//const User = require('../models/User')
const Activity = require('../models/Activity')
//const DailyReport = require('../models/DailyReport')
const asyncHandler = require('express-async-handler')
//const bcrypt = require('bcrypt')
const { format } = require('date-fns')


// @desc Get all records
// @route GET /records
// @access Private
const getAllRecords = asyncHandler(async (req, res) => {
    // Get all records from MongoDB
    const records = await Record.find().populate({ path: 'userId' }).exec()
    // If no records 
    if (!records?.length) {
        return res.status(400).json({ message: 'No records found' })
    }
    res.json(records)
})
const getRecordsByType = asyncHandler(async (req, res) => {
    const formType = req.params.formType
    // Get record by type

    const record = {}
    const records = (formType === 'Consumables') ?
        await ConsJrnl.find().populate({ path: 'userId' }).populate({ path: 'activityId' }).exec()
        : (formType === 'Equipment') ?
            await Equip.find().populate({ path: 'userId' }).populate({ path: 'activityId' }).exec()
            : (formType === 'Expenses') ?
                await Expense.find().populate({ path: 'userId' }).populate({ path: 'activityId' }).exec()
                : await Record.find().populate({ path: 'userId' }).populate({ path: 'activityId' }).exec()

    let activities = {}

    // If no record 
    if (!records?.length) {
        return res.status(400).json({ message: `Record for form type: ${formType} not found` })
    } else {
        // options
        activities = await (Activity.find({ "resources.type": formType }).find({ "resources.assignment.resourcesId": records._Id })).exec()
        //users = (await User.find().select("_id, username"))
        //dailyReports = await DailyReport.find({ "recordId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.records = records
    response.activities = activities
    response.formType = formType

    res.json(response)
})
const getRecordById = asyncHandler(async (req, res) => {
    const _id = req.params.id
    const formType = req.params.type
    // Get record by type
    // Get record by Id and return all the data for the options
    // retrieve Record by Id and include usename corresponsing to userId

    const record = (formType === 'Consumables') ?
        new ConsJrnl()
        : (formType === 'Equipment') ?
            new Equip()
            : (formType === 'Expenses') ?
                new Expense()
                : new Record()
    const result = await record.find({ "_id": _id }).populate({ path: 'userId' }).exec()
    let activities

    // If no record 
    if (!result?.length) {
        return res.status(400).json({ message: `${formType} id: ${_id} not found` })
    } else {
        // options
        //activities = await (Activity.find({ "resources.type": "Labour" }).find({ "resources.assignment.resourcesId": "emp001" })).exec()
        //users = (await User.find().select("_id, username"))
        //dailyReports = await DailyReport.find({ "recordId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.record = record
    response.activities = activities

    res.json(response)
})


const getRecordByActivityId = asyncHandler(async (req, res) => {
    const _id = req.params.id
    // Get record by Id and return all the data for the options

    // retrieve Record by Id and include usename corresponsing to userId
    let record = await Record.find({ "_id": _id }).populate({ path: 'userId' }).exec()
    let activities

    // If no record 
    if (!record?.length) {
        return res.status(400).json({ message: `Record id: ${_id} not found` })
    } else {
        // options
        //   activities = await (Activity.find({ "resources.type": "Labour" }).find({ "resources.assignment.resourcesId": "emp001" })).exec()
        //users = (await User.find().select("_id, username"))
        //dailyReports = await DailyReport.find({ "recordId": _id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.record = record
    response.activities = activities

    res.json(response)
})
// @desc Create new record
// @route POST /records
// @access Private
const createNewRecord = asyncHandler(async (req, res) => {
    const { details } = req.body

    // Check for duplicate details
    const duplicate = await Record.findOne({ details }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate details' })
    }

    // Create and store new record 
    const record = await Record.create(req.body)

    if (record) { //created 
        res.status(201).json({ message: `New record ${details} created` })
    } else {
        res.status(400).json({ message: 'Invalid record data received' })
    }
})

// @desc Update a record
// @route PATCH /records
// @access Private
const updateRecord = asyncHandler(async (req, res) => {
    const _id = req.body._id

    // Does the record exists for update?
    const record = await Record.findById(_id).exec()

    if (!record) {
        return res.status(400).json({ message: 'Record not found' })
    }

    record.userId = req.body.userId
    record.type = req.body.type
    record.details = req.body.details
    record.description = req.body.description
    record.dateTime = req.body.dateTime//format(Date(req.body.startDate), 'yyyy-MM-dd') + 'T23:59:59.999Z' //Date(req.body.startDate)
    //record.endDate = req.body.endDate//format(Date(req.body.endDate), 'yyyy-MM-dd') + 'T23:59:59.999Z'
    record.job = req.body.job
    record.terminal = req.body.terminal
    record.unit = req.body.unit
    record.amtType = req.body.amtType
    record.amount = req.body.amount
    record.fileInfo = req.body.fileInfo

    const result = await record.save()

    res.json({ message: `${result.name} updated` })
})

const updateRecords = async (req, res) => {
    const newData = req.body.data
    const formType = req.body.formType
    const formName = !formType ? 'Record' : formType
    const response = []
    const data = []
    let record
    for (let i = 0; i < newData.length; i++) {
        record = (formType === 'Consumables') ?
            new ConsJrnl()
            : (formType === 'Equipment') ?
                new Equip()
                : (formType === 'Expenses') ?
                    new Expense()
                    : new Record()

        record.userId = newData[i].userId ? newData[i].userId : null
        record.type = newData[i].type ? newData[i].type : null
        record.details = newData[i].details ? newData[i].details : null
        record.description = newData[i].description ? newData[i].description : null
        record.dateTime = newData[i].dateTime ? newData[i].dateTime : null
        record.job = newData[i].job ? newData[i].job : null
        record.terminal = newData[i].terminal ? newData[i].terminal : null
        record.unit = newData[i].unit ? newData[i].unit : null
        record.amtType = newData[i].amtType ? newData[i].amtType : null
        record.amount = newData[i].amount ? parseFloat(newData[i].amount) : null
        record.description = newData[i].description ? newData[i].description : null
        record.formId = newData[i].formId ? newData[i].formId : null
        record.amtType = newData[i].amtType ? newData[i].amtType : null
        record.posted = newData[i].posted ? newData[i].posted : false // default false

        if (newData[i]._id) {
            // Update
            record._id = newData[i]._id
            switch (formType) {
                case 'Consumables':
                    await ConsJrnl.findOneAndUpdate({ _id: newData[i]._id }, record, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formName} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formName} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formName} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
                case 'Equipment':
                    await Equip.findOneAndUpdate({ _id: newData[i]._id }, record, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formName} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formName} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formName} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
                case 'Expenses':
                    await Expense.findOneAndUpdate({ _id: newData[i]._id }, record, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formName} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formName} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formName} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
                default:
                    await Record.findOneAndUpdate({ _id: newData[i]._id }, record, { new: true }).then((result) => {
                        if (result === null) {
                            response.push({ message: `${formName} Id: : ${newData[i]._id},details: ${newData[i].details} not found update failed` })
                        } else {
                            response.push({ message: `${formName} Id: ${result._id},details: ${result.details} updated successfully` })
                            data.push(result)
                        }
                    }).catch((error) => {
                        response.push({ message: `error -- ${formName} Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
                    });
                    break;
            }

        } else {
            //create 
            await record.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `${formName} Id: ${newData[i]._id},details: ${newData[i].details} fail to saved` })
                    } else {
                        response.push({ message: `${formName} Id: ${result._id},details: ${result.details} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`error=${error}`)
                        console.log(`id: ${newData[i]._id},details: ${newData[i].details}` + error)
                        response.push({ message: `error -- ${formName} Id: (\'${data._id}\') create failed , error: ${error}` })
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
// @desc Delete a record
// @route DELETE /records
// @access Private
const deleteRecord = async (req, res) => {
    const { id, formType } = req.body.del
    const formName = !formType ? 'Record' : formType

    if (!formType) { return res.status(400).json({ message: `${formName} ID Required` }) }
    if (!id) { return res.status(400).json({ message: `${formName} ID Required` }) }
    try {
        const data = (formType === 'Consumables') ?
            await ConsJrnl.findOneAndDelete({ _id: id })
            : (formType === 'Equipment') ?
                await Equip.findOneAndDelete({ _id: id })
                : (formType === 'Expenses') ?
                    await Expense.findOneAndDelete({ _id: id })
                    : await Record.findOneAndDelete({ _id: id });
        //const data = await record.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `${formName}  Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ data: data, message: `${formName}  Id: (\'${data._id}\'), Details: (\'${data.details}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- ${formName}  Id: (\'${id}\') delete failed`, error: err })
    }
}
module.exports = {
    getAllRecords,
    getRecordsByType,
    getRecordById,
    createNewRecord,
    updateRecord,
    updateRecords,
    deleteRecord
}