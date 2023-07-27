const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        },
        activityDetails:
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            process: [{
                unit: { type: String },
                quantity: { type: Number },
                _id: false
            }],
            duration: [{
                unit: { type: String },
                quantity: { type: Number },
                _id: false
            }]
        }
        ,
        resources: [
            {
                item: { type: String },
                details: [],
                _id: false
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

