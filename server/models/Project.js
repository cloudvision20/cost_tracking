const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
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
}, {
    timestamps: true
})

module.exports = mongoose.model('Project', projectSchema)