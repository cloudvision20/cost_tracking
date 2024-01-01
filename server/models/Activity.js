const mongoose = require('mongoose')
//const AutoIncrement = require('mongoose-sequence')(mongoose)

const activitySchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Project'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        },
        startDate: { type: Date },
        endDate: { type: Date },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        process: {
            uom: { type: String },
            quantity: { type: Number },
        },
        duration: {
            uom: { type: String },
            quantity: { type: Number },
        },
        totalHR: {
            uom: { type: String },
            amount: { type: Number },
        },
        totalEquipment: {
            uom: { type: String },
            amount: { type: Number },
        },
        totalConsumable: {
            uom: { type: String },
            amount: { type: Number },
        }
        ,
        resources: [
            {
                type: { type: String },
                details: { type: String },
                job: { type: String },
                costType: { type: String },
                uom: { type: String },
                rate: { type: Number },
                qtyAssign: { type: Number },
                remarks: { type: String },
                assignment: [{ resourcesId: { type: String }, budget: { type: Number }, current: { type: Boolean }, _id: false }]
            }
        ],
        completed: {
            type: Boolean,
            default: false
        },
        active: { // 
            type: Boolean,
            default: true
        },

        mainActivityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Activity'
        },      
        
        activityType:{
            type: String,
        }
        
        
        // workProgress: { // remove?
        //     type: Boolean,
        //     required: false
        // }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Activity', activitySchema)

