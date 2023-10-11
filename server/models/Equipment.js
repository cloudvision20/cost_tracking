const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model('Equipment', equipmentSchema)