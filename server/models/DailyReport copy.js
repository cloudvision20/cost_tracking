const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose)

const dailyReportSchema = new mongoose.Schema(
    {
        activityId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Activity' },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String },
        text: { type: String },
        reportDate: { type: Date },
        reportDay: { type: String },
        manHour: {
            indirectPrev: { type: Number },
            indirectTdy: { type: Number },
            indirectCumm: { type: Number },
            directPrev: { type: Number },
            directTdy: { type: Number },
            directCumm: { type: Number },

            loading: [{
                indirect: { type: String }, // modify field name when clarified
                indirectPax: { type: Number },
                direct: { type: String },
                directPax: { type: Number },
                direct1: { type: String },
                directPax1: { type: Number },
                owner: { type: String },
                ownerPax: { type: Number }
            }],

            indirectTtl: { type: Number },
            directTtl: { type: Number },
            directTtl1: { type: Number },
            ownerTtl: { type: Number },
            pcSarawakians: { type: Number },
            pcNonSarawakians: { type: Number }

        },
        weatherChart: {
            //STATION NUMBER	STATION NAME	FUNCTION	DIVISION	RIVER BASIN	LATITUDE	LONGITUDE
            stationId:{type:String},
            stationName:{type:String}, 
            legend: { type: String },
            raining: { type: String },
            driziling: { type: String },
            sunny: { type: String },
            rain:[{start:{type:String}, end:{type: String}}]
        },
        tidalChart:{
            item: {type: Number},
            date: {type : String},
            time: {type:String},
            heght: {type:Number},
            location: {type:String}
        },
        meLoading: [{
            load1: { type: String }, // modify field name when clarified
            pax1: { type: Number },
            load2: { type: String }, // modify field name when clarified
            pax2: { type: Number },
            load3: { type: String }, // modify field name when clarified
            pax3: { type: Number },
            load4: { type: String }, // modify field name when clarified
            pax4: { type: Number },
            load5: { type: String }, // modify field name when clarified
            pax5: { type: Number },
        }],
        meLoadingTtl: { type: Number },

        //safetyToolbox
        safetyTbItem: { type: String },
        safetyTbDesp: { type: String },
        //downTime
        downTimeItem: { type: String },
        downTimeDesp: { type: String },
        //constructionProgress
        conProgressItem: { type: String },
        conProgressDesp: { type: String },
        conProgressStatus: { type: String },
        //nextDayWorkPlan
        nextDayWPItem: { type: String },
        nextDayWPDesp: { type: String },
        nextDayWPRemarks: { type: String },

        //projectMaterial
        prjMaterialItem: { type: String },
        prjMaterialDocNo: { type: String }, //PO ,DO number
        prjMaterialQty: { type: Number },
        prjMaterialStatus: { type: String }, // status and remarks
        //areaOfConcern
        aocItem: { type: String },
        aocDesp: { type: String }, //PO ,DO number
        aocRemedialPlan: { type: String },
        aocStatus: { type: String }, // status and remarks
        aocDtResolved: { type: String },
        //site Tech Query
        siteTechQItem: { type: String },
        siteTechQIDesp: { type: String }, //PO ,DO number
        siteTechQIDtRaised: { type: String },
        siteTechQIDtResolved: { type: String },
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