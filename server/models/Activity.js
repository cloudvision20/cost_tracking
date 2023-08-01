const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const activitySchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Project'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        process: {
            uom: { type: String },
            quantity: { type: Number },
        },
        duration: {
            uom: { type: String },
            quantity: { type: Number },
        },
        totalHR: {
            uom: { type: String },
            amount: { type: Number },
        },
        totalEquipment: {
            uom: { type: String },
            amount: { type: Number },
        },
        totalConsumable: {
            uom: { type: String },
            amount: { type: Number },
        }
        ,
        resources: [
            {
                type: { type: String },
                details: { type: String },
                job: { type: String },
                costType: { type: String },
                uom: { type: String },
                rate: { type: Number },
                qtyAssign: { type: Number },
                remarks: { type: String },
                assignment: [{ resourcesId: { type: String }, budget: { type: Number }, _id: false }]
            }
        ],
        completed: {
            type: Boolean,
            default: false
        },
        workProgress: {
            type: String,
            required: false
        }
        // ,
        // createdAt: Date,
        // updatedAt: Date
    },
    {
        timestamps: true
    }
)
// activitySchema.plugin(AutoIncrement, {
//     inc_field: 'ticket',
//     id: 'ticketNums',
//     start_seq: 500
// })

module.exports = mongoose.model('Activity', activitySchema)

