const DailyReport = require('../models/DailyReport')
const User = require('../models/User')

// @desc Get all dailyReports 
// @route GET /dailyReports
// @access Private
const getAllDailyReports = async (req, res) => {
    // Get all dailyReports from MongoDB
    const dailyReports = await DailyReport.find().lean()

    // If no dailyReports 
    if (!dailyReports?.length) {
        return res.status(400).json({ message: 'No dailyReports found' })
    }

    // Add username to each dailyReport before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const dailyReportsWithUser = await Promise.all(dailyReports.map(async (dailyReport) => {
        const user = await User.findById(dailyReport.userId).lean().exec()
        return { ...dailyReport, username: user.username }
    }))

    res.json(dailyReportsWithUser)
}

// @desc Create new dailyReport
// @route POST /dailyReports
// @access Private
const createNewDailyReport = async (req, res) => {
    const { userId } = req.body

    // Confirm data
    if (!userId) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // // Check for duplicate title
    // const duplicate = await DailyReport.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // if (duplicate) {
    //     return res.status(409).json({ message: 'Duplicate Daily Report title' })
    // }

    // Create and store the new userId 
    const dailyReport = await DailyReport.create(req.body)

    if (dailyReport) { // Created 
        return res.status(201).json({ message: `New dailyReport ${req.body.reportDate} created` })
    } else {
        return res.status(400).json({ message: 'Invalid dailyReport data received' })
    }

}

// @desc Update a dailyReport
// @route PATCH /dailyReports
// @access Private
const updateDailyReport = async (req, res) => {
    //const { id, userId, completed } = req.body

    // Confirm data
    // if (!id || !userId || typeof completed !== 'boolean') {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    // Confirm dailyReport exists to update
    const dailyReport = await DailyReport.findById(req.body._id).exec()

    if (!dailyReport) {
        return res.status(400).json({ message: 'DailyReport not found' })
    }

    // // Check for duplicate title
    // const duplicate = await DailyReport.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original dailyReport 
    // if (duplicate && duplicate?._id.toString() !== req.body._id) {
    //     return res.status(409).json({ message: 'Duplicate dailyReport title' })
    // }

    let weatherChart = {}
    let manHour = {}

    dailyReport.activityId = req.body.activityId
    dailyReport.userId = req.body.userId
    dailyReport.title = req.body.title
    dailyReport.text = req.body.text
    dailyReport.reportDate = req.body.reportDate
    dailyReport.reportDay = req.body.reportDay

    manHour.indirectPrev = req.body.manHour.indirectPrev
    manHour.indirectTdy = req.body.manHour.indirectTdy
    manHour.indirectCumm = req.body.manHour.indirectCumm
    manHour.directPrev = req.body.manHour.directPrev
    manHour.directTdy = req.body.manHour.directTdy
    manHour.directCumm = req.body.manHour.directCumm

    manHour.loading = req.body.manHour.loading

    manHour.indirectTtl = req.body.manHour.indirectTtl
    manHour.directTtl = req.body.manHour.directTtl
    manHour.directTtl1 = req.body.manHour.directTtl1
    manHour.ownerTtl = req.body.manHour.ownerTtl
    manHour.pcSarawakians = req.body.manHour.pcSarawakians
    manHour.pcNonSarawakians = req.body.manHour.pcNonSarawakians

    dailyReport.manHour = manHour

    //weatherChart.legend = req.body.legend
    weatherChart.raining = req.body.weatherChart.raining
    weatherChart.driziling = req.body.weatherChart.driziling
    weatherChart.sunny = req.body.weatherChart.sunny

    dailyReport.weatherChart = weatherChart
    dailyReport.meLoading = req.body.meLoading

    dailyReport.meLoadingTtl = req.body.meLoadingTtl

    //safetyToolbox
    dailyReport.safetyTbItem = req.body.safetyTbItem
    dailyReport.safetyTbDesp = req.body.safetyTbDesp
    //downTime
    dailyReport.downTimeItem = req.body.downTimeItem
    dailyReport.downTimeDesp = req.body.downTimeDesp
    //constructionProgress
    dailyReport.conProgressItem = req.body.conProgressItem
    dailyReport.conProgressDesp = req.body.conProgressDesp
    dailyReport.conProgressStatus = req.body.conProgressStatus
    //nextDayWorkPlan
    dailyReport.nextDayWPItem = req.body.nextDayWPItem
    dailyReport.nextDayWPDesp = req.body.nextDayWPDesp
    dailyReport.nextDayWPRemarks = req.body.nextDayWPRemarks

    //projectMaterial
    dailyReport.prjMaterialItem = req.body.prjMaterialItem
    dailyReport.prjMaterialDocNo = req.body.prjMaterialDocNo //PO ,DO number
    dailyReport.prjMaterialQty = req.body.prjMaterialQty
    dailyReport.prjMaterialStatus = req.body.prjMaterialStatus // status and remarks
    //areaOfConcern
    dailyReport.aocItem = req.body.aocItem
    dailyReport.aocDesp = req.body.aocDesp //PO ,DO number
    dailyReport.aocRemedialPlan = req.body.aocRemedialPlan
    dailyReport.aocStatus = req.body.aocStatus// status and remarks
    dailyReport.aocDtResolved = req.body.aocDtResolved
    //site Tech Query
    dailyReport.siteTechQItem = req.body.siteTechQItem
    dailyReport.siteTechQIDesp = req.body.siteTechQIDesp//PO ,DO number
    dailyReport.siteTechQIDtRaised = req.body.siteTechQIDtRaised
    dailyReport.siteTechQIDtResolved = req.body.siteTechQIDtResolved
    dailyReport.preparedBy = req.body.preparedBy
    dailyReport.verifiedBy = req.body.verifiedBy //PO ,DO number
    dailyReport.acknowledgedBy = req.body.acknowledgedBy
    dailyReport.completed = req.body.completed






    const updatedDailyReport = await dailyReport.save()

    res.json(`'${updatedDailyReport.reportDate}' updated`)
}

// @desc Delete a dailyReport
// @route DELETE /dailyReports
// @access Private
const deleteDailyReport = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'DailyReport ID required' })
    }

    // Confirm dailyReport exists to delete 
    const dailyReport = await DailyReport.findById(id).exec()

    if (!dailyReport) {
        return res.status(400).json({ message: 'DailyReport not found' })
    }

    const result = await dailyReport.deleteOne()

    const reply = `DailyReport '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllDailyReports,
    createNewDailyReport,
    updateDailyReport,
    deleteDailyReport
}