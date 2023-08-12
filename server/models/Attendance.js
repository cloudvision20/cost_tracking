const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const attendanceSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        employeeId: { type: String, required: true },
        clockType: { type: String }, // IN/OUT
        date: { type: String },
        time: { type: String },
        weekday: { type: String },
        terminal: { type: String } // Login machine reference
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Attendance', attendanceSchema)

