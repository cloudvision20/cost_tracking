const mongoose = require('mongoose')
const { masterSchema } = require('./Master')
module.exports = (new mongoose.model('Cash', masterSchema))


/* const mongoose = require('mongoose')

const cashSchema = new mongoose.Schema({
    type: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    remarks: { type: String }
})

module.exports = (new mongoose.model('Cash', cashSchema)) */