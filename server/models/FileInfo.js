const mongoose = require('mongoose')

const fileInfoSchema = new mongoose.Schema({
    fileInfoname: {
        type: String,
        required: false
    },
    path: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    roles: {
        type: [String],
        default: ["Employee"]
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Activity'
    },    
    dailyReportId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'DailyReport'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
})

module.exports = mongoose.model('FileInfo', fileInfoSchema)