const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const attendanceSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        employeeId: {
            type: String,
            required: true
        },
        clockType: { String }, // IN/OUT
        date: { String },
        time: { String },
        weekday: { String },
        terminal: { String }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Attendance', attendanceSchema)

