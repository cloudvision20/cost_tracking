const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)
const rateSchema = new mongoose.Schema(
    {
        resourceId: { type: String, required: true },
        uom: { type: String },
        quantity: { type: Number },
        rate: { type: Number }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Rate', rateSchema)
