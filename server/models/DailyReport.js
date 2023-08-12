const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose)

const dailyReportSchema = new mongoose.Schema(
    {
        activityId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Activity' },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String, required: true },
        text: { type: String, required: true },
        manHour: {
            indirectPrevious: { type: Number },
            indirectToday: { type: Number },
            indirectCummulative: { type: Number },
            directPrevious: { type: Number },
            directToday: { type: Number },
            directCummulative: { type: Number },
            weatherChart: {
                legend: { type: String },
                raining: { type: String },
                driziling: { type: String },
                Sunny: { type: String }
            },
            indirectLoading: [{
                text: { type: String }, // modify field name when clarified
                pax: { type: Number },
                _id: false
            }],
            directLoading: [{
                text: { type: String }, // modify field name when clarified
                pax: { type: Number },
                _id: false
            }],
            ownerLoading: [{
                text: { type: String }, // modify field name when clarified
                pax: { type: Number },
                _id: false
            }],
            indirectLoadingTotal: { type: Number },
            directLoadingTotal: { type: Number },
            ownerLoadingTotal: { type: Number },
            percentSarawakians: { type: Number },
            percentNonSarawakians: { type: Number }

        },
        machineEquipLoading: {
            indirectLoading: [{
                text: { type: String }, // modify field name when clarified
                pax: { type: Number },
                _id: false
            }],
            directLoading: [{
                text: { type: String }, // modify field name when clarified
                pax: { type: Number },
                _id: false
            }],
            ownerLoading: [{
                text: { type: String }, // modify field name when clarified
                pax: { type: Number },
                _id: false
            }],
            LoadingTotal: { type: Number },
        },
        safetyToolbox: {
            item: { type: String },
            description: { type: String }
        },
        downTime: {
            item: { type: String },
            description: { type: String }
        },
        constructionProgress: {
            item: { type: String },
            description: { type: String },
            status: { type: String }
        },
        nextDayWorkPlan: {
            item: { type: String },
            description: { type: String },
            remarks: { type: String }
        },
        projectMaterial: {
            item: { type: String },
            docNo: { type: String }, //PO ,DO number
            quantity: { type: Number },
            status: { type: String } // status and remarks
        },
        areaOdConcern: {
            item: { type: String },
            description: { type: String }, //PO ,DO number
            remedialPlan: { type: String },
            status: { type: String }, // status and remarks
            dateResolved: { type: String }
        },
        areaOdsiteQuery: {
            item: { type: String },
            description: { type: String }, //PO ,DO number
            dateRaised: { type: String },
            dateResolved: { type: String }
        },
        preparedBy: { type: String },
        verifiedBy: { type: String }, //PO ,DO number
        acknowledgedBy: { type: String },
        completed: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('DailyReport', dailyReportSchema)