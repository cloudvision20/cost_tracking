const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    startDate: { type: Date },
    endDate: { type: Date },
    budgetTotals: [{
        budgetType: { type: String }, //HR, Equipment, Comsumables
        uom: { type: String },
        amount: { type: Number },
        _id: false
    }],
    contacts: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId },
            _id: false
        }
    ],
    completed: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Project', projectSchema)