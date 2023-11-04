const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    category: { // budget , png, 
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Type', typeSchema)