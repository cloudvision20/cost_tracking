const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    contactInfo: [
        {
            email: String,
            phone: String,
            whatsapp: String,
            _id: false
        }
    ],
    roles: {
        type: [String],
        default: ["Employee"]
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)