const Activity = require('../models/Activity')
const User = require('../models/User')
const Project = require('../models/Project')
const DailyReport = require('../models/DailyReport')
const Equipment = require('../models/Equipment')
const Consumable = require('../models/Consumable')
const Expense = require('../models/Expense')
const Attend = require('../models/Attendance')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { format, daysToWeeks } = require('date-fns')
const dateFns = require('date-fns')


// @desc Get all activities
// @route GET /activities
// @access Private
const getAllActivities = asyncHandler(async (req, res) => {
    // Get all activities from MongoDB
    const activities = await Activity.find().lean()
    // If no activities 
    if (!activities?.length) {
        return res.status(400).json({ message: 'No activities found' })
    }
    res.json(activities)
})

// @desc Get all activities group by project aggregrate
// @route GET /actsbyprojs
// @access Private
const getActivitiesByProjs = asyncHandler(async (req, res) => {
    let response = {}
    const projects = await Activity.aggregate(
        [
            {
                $group: {
                    _id: '$projectId',
                    projects: { $push: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'project'
                }
            },
            { $unwind: '$project' },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            '$project',
                            { activities: '$projects' }
                        ]
                    }
                }
            },
            {
                $sort: {
                    projectId: 1,
                    startDate: 1,
                },
            },
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );
    // const activities = await Activity.aggregate(
    //     [
    //         {
    //             $group: {
    //                 _id: '$projectId',
    //                 activities: { $push: '$$ROOT' }
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'projects',
    //                 localField: '_id',
    //                 foreignField: '_id',
    //                 as: 'project'
    //             }
    //         }
    //     ],
    //     { maxTimeMS: 60000, allowDiskUse: true }
    // );
    // const activities = await Activity.aggregate(
    //     [
    //         {
    //           $group: {
    //             _id: '$projectId',
    //             activities: { $push: '$$ROOT' }
    //           }
    //         }
    //       ],
    //       { maxTimeMS: 60000, allowDiskUse: true }
    //   );

    // response.projects = projects
    const proj = await Promise.all(projects.map(async (project) => {
        let ttlPlanLabour = 0
        let ttlPlanEquipment = 0
        let ttlPlanConsumables = 0
        let ttlPlanExpenses = 0
        const labourIds = [] // collect all user ids
        const equipmentIds = [] // collect all equipment ids
        const consumableIds = [] // collect all consukmable ids
        const attendances = []

        const acts = project.activities.map((activity) => {
            const labour = [] // collect all user ids
            const equipment = [] // collect all equipment ids
            const consumable = [] // collect all consukmable ids
            const resLabour = activity.resources.filter((resource) => resource.type === 'Labour').map((filteredResources) => {
                const data = filteredResources.assignment
                data.map(dt => {
                    labour.push(dt.resourcesId)
                    labourIds.push(dt.resourcesId)
                    //console.log("resourcesId = " + dt.resourcesId)
                })
                const ttlLabour = data.reduce((a, v) => a = a + v.budget, 0)

                ttlPlanLabour = ttlPlanLabour + ttlLabour
                // return {
                //     ttlPlanLabour
                // }
            })
            const resEquipment = activity.resources.filter((resource) => resource.type === 'Equipment').map((filteredResources) => {
                const data = filteredResources.assignment
                data.map(dt => {
                    equipment.push(dt.resourcesId)
                    equipmentIds.push(dt.resourcesId)
                    //console.log("resourcesId = " + dt.resourcesId)
                })
                const ttlEquipment = data.reduce((a, v) => a = a + v.budget, 0)
                ttlPlanEquipment = ttlPlanEquipment + ttlEquipment
                // return {
                //     ttlPlanLabour
                // }
            })
            const resConsumable = activity.resources.filter((resource) => resource.type === 'Consumables').map((filteredResources) => {
                const data = filteredResources.assignment
                data.map(dt => {
                    consumable.push(dt.resourcesId)
                    consumableIds.push(dt.resourcesId)
                    //console.log("resourcesId = " + dt.resourcesId)
                })
                const ttlConsumables = data.reduce((a, v) => a = a + v.budget, 0)
                ttlPlanConsumables = ttlPlanConsumables + ttlConsumables
                // return {
                //     ttlPlanLabour
                // }
            })

            return {
                "name": activity.name,
                "labour_ids": labour,
                "equipment_ids": equipment,
                "consumable_ids": consumable
            }
        }
        )
        //----------------------------------------------------------------------------------------------
        //----------------------------------------------------------------------------------------------
        //Get attendance
        //----------------------------------------------------------------------------------------------
        // await Attend.find({ userId: { $in: labourIds } }).then((result) => {
        //     if (result === null) {
        //         console.log(`Attendance data not found`)
        //     }
        //     attendances.push(result)
        // }).catch((error => {
        //     // console.log(`error : Loading Error`)
        // }))
        //----------------------------------------------------------------------------------------------
        const startDate = '01-07-2023'
        const endDate = '07-07-2023'
        const filter =
            [
                {
                    $match: {
                        employeeId: { $in: labourIds },
                        date: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            date: '$date',
                            employeeName: '$employeeName',
                            employeeId: '$employeeId',
                            userId: '$userId'
                            // clockType: '$clockType'
                        },
                        documents: { $push: '$$ROOT' }
                    }
                },
                { $sort: { time: 1 } }
            ]
        let response = {}
        let attends = {}
        await Attend.aggregate(filter).then((result) => {
            if (result === null) {
                console.log(`Attendance data not found for Employee ID =${employeeId}`)
            }
            console.log('result =' + JSON.stringify(result))
            attends = result
        }).catch((error => {
            console.log(`error : Loading Error`)
        }))
        const attendsDetails = attends.map((att) => {
            dts = att.documents[att.documents.length - 1].date.split("-")
            dte = att.documents[0].date.split("-")

            tms = att.documents[att.documents.length - 1].time //.split(":")
            tme = att.documents[0].time //.split(":")
            const times = new Date(`${dts[2]}-${dts[1]}-${dts[0]} ${tms} GMT+0800`)
            const timee = new Date(`${dte[2]}-${dte[1]}-${dte[0]} ${tme} GMT+0800`)
            const diff = Math.abs(dateFns.differenceInMinutes(times, timee))
            return {


                // newTime: new Date(dts[2], dts[1], dts[0], tms[1], tms[0]),
                // new0Time: new Date(parseInt(dts[2]), parseInt(dts[1]), parseInt(dts[0]), parseInt(tms[1]), parseInt(tms[0])),
                new1Time: timee.toLocaleString(),
                //tstTime: dateFns.parseJSON(new Date()),
                inTime: att.documents[att.documents.length - 1].datetime,
                outTime: att.documents[0].datetime,
                diff: diff,
                hrDiff: parseInt(diff / 60),//Math.floor(dateFns.differenceInMinutes(times, timee) / 60),
                minDiff: diff % 60,
                workHour: parseInt(diff / 60) - 1
                // consolelogdts: JSON.stringify(dts),
                // consolelogtms: JSON.stringify(tms),



            }
        })
        let ttlActualLabour = attendsDetails.reduce(function (prev, current) {
            return prev + +current.workHour
        }, 0);
        let percentLabour = (ttlActualLabour / ttlPlanLabour) * 100
        //----------------------------------------------------------------------------------------------
        //----------------------------------------------------------------------------------------------
        return {
            // actLabour,
            "_id": project._id,
            "title": project.title,
            "activities": acts,
            "allLabour_ids": labourIds,
            "allEquipment_ids": equipmentIds,
            "allConsumable_ids": consumableIds,
            attendsDetails,
            ttlPlanLabour,
            ttlActualLabour,
            percentLabour,
            ttlPlanEquipment,
            ttlPlanConsumables
        }
    }
    )
    ) //all Promise
    response = proj
    res.status(200).json(response)

})


const getActivityById = asyncHandler(async (req, res) => {
    const id = req.params.id
    // retrieve Activity by Id and include usename corresponsing to userId
    let activity = await Activity.find({ "_id": id }).populate({ path: 'userId', select: 'username' }).populate({ path: 'projectId' }).exec()
    let projects
    let users
    let equipment
    let consumables
    let dailyReports

    // If no activity 
    if (!activity?.length) {
        return res.status(400).json({ message: `Activity id: ${id} not found` })
    } else {
        // options
        projects = await Project.find().lean()
        users = (await User.find().lean())//.select('_id, username, employeeId, employeeName'))
        equipment = (await Equipment.find().select("_id, name"))
        consumables = (await Consumable.find().select("_id, name"))
        dailyReports = await DailyReport.find({ "activityId": id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.activity = activity
    response.projects = projects
    response.users = users
    response.dailyReports = dailyReports
    response.equipment = equipment
    response.consumables = consumables
    res.json(response)
})

const getActivityByUserId = asyncHandler(async (req, res) => {
    const id = req.params.id
    //const activities = await (Activity.find({ "resources.type": "Labour", "active": true }).find({ "resources.assignment.resourcesId": id })).exec()

    const user = await User.find({ "_id": id }).select('-password').populate({ path: 'currActivityId', select: 'name' }).lean()
    let activities = await (Activity.find({ "resources.assignment.resourcesId": user.employeeId, "active": true })).exec()
    let response = {}

    let current = {}
    if (user[0]) {
        current.activityId = user[0]?.currActivityId?._id ? user[0].currActivityId._id : null
        current.name = user[0]?.currActivityId?.name ? user[0].currActivityId.name : null
    }
    if (activities.length === 1 && user[0]?.currActivityId?._id !== null) {
        current.activityId = activities[0]._id
        current.name = activities[0].name

        await User.findOneAndUpdate({ _id: id }, { "currActivityId": activities[0].id }, { new: true }).then((data) => {
            if (data === null) {
                console.log(` getActivityByUserId: error -- User Id: (${id}) not found update failed `);
            }
            console.log(` getActivityByUserId: User Id: (\'${id}\'), currActivityId: (${activities[0].id}), updated successfully`)
        }).catch((error) => {

            console.log(` getActivityByUserId: error -- User Id: (${id}) update failed error: ${error}`)
        });
    }
    response.activities = activities
    response.current = current
    res.json(response)
})

const getActivityByProjId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const activities = await Activity.find({ "projectId": id }).populate({ path: 'userId', select: 'username' }).exec()
    if (!activities?.length) {
        return res.status(400).json({ message: 'No activities found' })
    }
    res.json(activities)
})


// @desc Create new activity
// @route POST /activities
// @access Private
const createNewActivity = asyncHandler(async (req, res) => {
    const { name } = req.body

    // Check for duplicate name
    const duplicate = await Activity.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // Create and store new activity 
    const activity = await Activity.create(req.body)

    if (activity) { //created 
        res.status(201).json({ message: `New activity ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid activity data received' })
    }
})

// @desc Update a activity
// @route PATCH /activities
// @access Private
const updateActivity = asyncHandler(async (req, res) => {
    let id = req.body.id ? req.body.id
        : req.body._id ? req.body._id
            : undefined

    // Does the activity exists for update?
    let activity = await Activity.findById(id).exec()

    if (!activity) {
        return res.status(400).json({ message: 'Activity not found' })
    }

    await Activity.findOneAndUpdate({ _id: id }, req.body, { new: true }).then((data) => {
        if (data === null) {
            throw new Error(`Activity Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Activity Id: (\'${data._id}\'), Activity (name: \'${data.name}\') updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Activity Id: (\'${id}\') update failed`, error: error })
    });
})

// @desc Delete a activity
// @route DELETE /activities
// @access Private
const deleteActivity = asyncHandler(async (req, res) => {
    const { id } = req.body
    // Confirm data -- check if id is  available
    if (!id) {
        return res.status(400).json({ message: 'Activity ID Required' })
    }

    try {
        const data = await Activity.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Activity Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `Activity Id: (\'${data._id}\'), name: (\'${data.name}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Activity Id: (\'${id}\') delete failed`, error: err })
    }
})

module.exports = {
    getAllActivities,
    getActivitiesByProjs,
    getActivityById,
    getActivityByUserId,
    getActivityByProjId,
    createNewActivity,
    updateActivity,
    deleteActivity
    // ,getActivityByType
}