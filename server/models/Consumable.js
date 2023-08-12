const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const consumableSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true
        },
        datetime: { type: Date },
        type: { type: String },
        model: { type: String },
        unit: { type: String },
        amount: { type: Number }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Consumable', consumableSchema)

