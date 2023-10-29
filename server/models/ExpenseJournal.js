const mongoose = require('mongoose')
const { recordSchema } = require('./Record')
module.exports = (new mongoose.model('ExpenseJournal', recordSchema))
