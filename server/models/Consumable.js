const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const consumableSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true
        },
        datetime: { Date },
        type: { String },
        model: { String },
        unit: { String },
        amount: { Number }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Consumable', consumableSchema)

