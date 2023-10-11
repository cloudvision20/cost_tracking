const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const equipmentJournalSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        },
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Activity'
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Project'
        },
        datetime: { type: Date }, // date time of transaction
        type: { type: String },
        details: { type: String },
        job: { type: String },
        terminal: { type: String },//?
        unit: { type: String },
        amtType: { type: String }, // IN / OUT , Start / End?
        amount: { type: Number },
        fileInfo: { type: String },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('EquipmentJournal', equipmentJournalSchema)

