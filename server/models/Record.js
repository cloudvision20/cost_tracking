const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const recordSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Activity'
        },
        /*       projectId: {
                   type: mongoose.Schema.Types.ObjectId,
                   required: false,
                   ref: 'Project'
               }, */
        dateTime: { type: Date }, // date time of transaction
        type: { type: String },
        details: { type: String },
        job: { type: String },
        terminal: { type: String },//?
        unit: { type: String },
        amtType: { type: String }, // IN / OUT , Start / End?
        amount: { type: Number },
        description: { type: String },
        formId: { type: String },
        posted: { type: Boolean },
        fileInfo: [{ type: String }],
    },
    {
        timestamps: true
    }
)

// module.exports = mongoose.model('Record', recordSchema)
const Record = new mongoose.model('Record', recordSchema)
module.exports = { Record, recordSchema }
