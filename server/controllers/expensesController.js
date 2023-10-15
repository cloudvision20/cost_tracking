const Expense = require('../models/Expense')
const bcrypt = require('bcrypt')

// @desc Get all expenses
// @route GET /expenses
// @access Private
const getAllExpenses = async (req, res) => {
    // Get all expenses from MongoDB
    const expenses = await Expense.find().lean()

    // If no expenses 
    if (!expenses?.length) {
        return res.status(400).json({ message: 'No expenses found' })
    }

    res.status(200).json(expenses)
}

// @desc Create new expense
// @route POST /expenses
// @access Private
const createNewExpense = async (req, res) => {
    const { name, type, capacity } = req.body

    // Confirm data
    if (!name) {
        return res.status(400).json({ message: 'name is required' })
    }

    // Check for duplicate name
    const duplicate = await Expense.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate expense' })
    }

    const expense = {}

    if (name) { expense.name = name }
    if (type) { expense.type = type }
    if (capacity) { expense.capacity = parseFloat(capacity) }

    // Create and store new expense 
    const result = await Expense.create(expense)

    if (result) { //created 
        res.status(201).json({ message: `New expense ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid expense data received' })
    }
}

// @desc Update a expense
// @route PATCH /expenses
// @access Private
const saveExpense = async (req, res) => {
    const { id, name, type, capacity } = req.body

    // Confirm data 
    if (!name) {
        return res.status(400).json({ message: 'name required' })
    }

    // Does the expense exist to update?
    const expense = await Expense.findById(id).exec()

    if (!expense) {
        return res.status(400).json({ message: 'Expense not found' })
    }

    // Check for duplicate 
    const duplicate = await Expense.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original expense 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    if (name) { expense.name = name }
    if (type) { expense.type = type }
    if (capacity) { expense.capacity = parseFloat(capacity) }

    const result = await expense.save()

    res.json({ message: `${result.name} updated` })
}

// @desc Update a expense
// @route PATCH /expenses
// @access Private
const updateExpense = async (req, res) => {
    const { name, type, capacity } = req.body

    let id
    req.body.id ? id = req.body.id
        : req.body._id ? id = req.body._id
            : id = undefined
    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'Expense Id is required' })
    }

    // Does the expense exist to update?
    const expenseFound = await Expense.findById(id).exec()

    if (!expenseFound) {
        return res.status(400).json({ message: 'Expense not found' })
    }

    // Check for duplicate 
    const duplicate = await Expense.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original expense 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' })
    }
    let expense = {}
    if (name) { expense.name = name }
    if (type) { expense.type = type }
    if (capacity) { expense.capacity = parseFloat(capacity) }

    await Expense.findOneAndUpdate({ _id: id }, expense, { new: true }).then((result) => {
        if (result === null) {
            throw new Error(`Expense Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Expense Id: (\'${result._id}\'), Name: (\'${result.name}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Expense Id: (\'${id}\') update failed`, error: error })
    });
}

const updateExpenses = async (req, res) => {
    const newData = req.body.data
    const response = []
    const data = []
    let expense
    for (let i = 0; i < newData.length; i++) {
        expense = new Expense()
        if (newData[i].name) { expense.name = newData[i].name }
        if (newData[i].type) { expense.type = newData[i].type }
        if (newData[i].capacity) { expense.capacity = parseFloat(newData[i].capacity) }
        if (newData[i]._id) {
            // Update
            expense._id = newData[i]._id
            await Expense.findOneAndUpdate({ _id: newData[i]._id }, expense, { new: true }).then((result) => {
                if (result === null) {
                    response.push({ message: `Expense Id: : ${newData[i]._id},name: ${newData[i].name} not found update failed` })
                } else {
                    response.push({ message: `Expense Id: ${result._id},name: ${result.name} updated successfully` })
                    data.push(result)
                }
            }).catch((error) => {
                response.push({ message: `error -- Expense Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
            });
        } else {
            //create 
            await expense.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Expense Id: ${newData[i]._id},name: ${newData[i].name} fail to saved` })
                    } else {
                        response.push({ message: `Expense Id: ${result._id},name: ${result.name} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`result=${result}`)
                        console.log(`id: ${newData[i]._id},name: ${newData[i].name}` + error)
                        response.push({ message: `error -- Expense Id: (\'${data._id}\') create failed , error: ${error}` })
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
// @desc Delete a expense
// @route DELETE /expenses
// @access Private
const deleteExpense = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Expense ID Required' })
    }

    try {
        const data = await Expense.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Expense Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ data: data, message: `Expense Id: (\'${data._id}\'), Name: (\'${data.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Expense Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllExpenses,
    createNewExpense,
    saveExpense,
    updateExpenses,
    deleteExpense
}