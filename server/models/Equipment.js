const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
    equipment: {
        type: String,
        required: true
    },
    equipmentType: {
        type: String,
        required: true
    },
    consumableType: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Equipment', equipmentSchema)