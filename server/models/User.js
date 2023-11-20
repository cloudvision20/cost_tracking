const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    contactInfo:
    {
        email: String,
        phone: String,
        whatsapp: String,
        _id: false
    }
    ,
    roles: {
        type: [String],
        default: ["Employee"]
    },
    currActivityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Activity'
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)