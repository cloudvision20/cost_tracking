const mongoose = require('mongoose')
const { masterSchema } = require('./Master')
module.exports = (new mongoose.model('Expense', masterSchema))