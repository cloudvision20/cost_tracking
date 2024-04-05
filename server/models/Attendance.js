const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const attendanceSchema = new mongoose.Schema(
    {
        //"Employee No","Employee Name","Date","Weekday","Time","DateTime","IO Status","Device ID"
        userId: { type: String, required: true },
        activityId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Activity' },
        employeeId: { type: String, required: true }, //"Employee No"
        employeeName: { type: String, required: true }, //"Employee Name"
        clockType: { type: String }, // "IO Status"
        date: { type: String },//"Date"
        time: { type: String }, //"Time"
        weekday: { type: String },//"Weekday"
        datetime: { type: Date }, //DateTime?
        dateTimre: { type: Date },
        terminal: { type: String } // Login machine reference
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Attendance', attendanceSchema)

