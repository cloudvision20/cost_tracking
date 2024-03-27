const Activity = require('../models/Activity')
const User = require('../models/User')

const ConsJrnl = require('../models/ConsumableJournal')
const EquipJrnl = require('../models/EquipmentJournal')
const ExpenseJrnl = require('../models/ExpenseJournal')

const Attend = require('../models/Attendance')
const Type = require('../models/Type')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { format, daysToWeeks } = require('date-fns')
const dateFns = require('date-fns')



/*****************************************************************************************************
 * 
 *  Get All aggregates for all projects
 *  Aggregate budget and actual amount for
 *  1. Labour
 *  2. Comsumables
 *  3. Equipment
 *  4. Expenses
 * 
 * 
 ****************************************************************************************************/
// @desc Get all activities group by project aggregrate
// @route GET /actsbyprojs
// @access Private
// For all projects 
const getActivitiesByProjs = asyncHandler(async (req, res) => {
    const startDate = req.params?.startDate ? req.params.startDate : '01-07-2023'
    const endDate = req.params?.endDate ? req.params.endDate : '07-11-2023'
    const s = startDate.split('-')
    const e = endDate.split('-')


    const sDate = new Date(+s[2], +s[1] - 1, +s[0], +0, +0, +0) //+year, +month - 1, +day
    const eDate = new Date(+e[2], +e[1] - 1, +e[0], +23, +59, +59)
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
        const expenseIds = [] // collect all expense ids
        const attendances = []

        let consumableDetails = {}
        let equipmentDetails = {}
        let expenseDetails = {}

        let ttlActualConsumables = 0
        let ttlActualExpenses = 0
        let ttlActualEquipment = 0

        const acts = project.activities.map((activity) => {
            const labour = [] // collect all user ids
            const equipment = [] // collect all equipment ids
            const consumable = [] // collect all consumable ids
            const expense = [] // collect all expense ids
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
                const ttlPEquipment = data.reduce((a, v) => a = a + v.budget, 0)
                ttlPlanEquipment = ttlPlanEquipment + ttlPEquipment
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
                const ttlPConsumables = data.reduce((a, v) => a = a + v.budget, 0)
                ttlPlanConsumables = ttlPlanConsumables + ttlPConsumables
                // return {
                //     ttlPlanLabour
                // }
            })
            const resExpense = activity.resources.filter((resource) => resource.type === 'Expenses').map((filteredResources) => {
                const data = filteredResources.assignment
                data.map(dt => {
                    expense.push(dt.resourcesId)
                    expenseIds.push(dt.resourcesId)
                    //console.log("resourcesId = " + dt.resourcesId)
                })
                const ttlPExpenses = data.reduce((a, v) => a = a + v.budget, 0)
                ttlPlanExpenses = ttlPlanExpenses + ttlPExpenses
                // return {
                //     ttlPlanLabour
                // }
            })


            return {
                "name": activity.name,
                "labour_ids": labour,
                "equipment_ids": equipment,
                "consumable_ids": consumable,
                "expense_ids": expense
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
        // let response = {}
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
        let percentLabour = Math.round(((ttlActualLabour / ttlPlanLabour) * 100 + Number.EPSILON) * 100) / 100
        //----------------------------------------------------------------------------------------------
        /*****************************************************************************************************
        * 
        *  Consumables Journal, Equipment Journal, Expenses Journal
        * 
        *****************************************************************************************************/

        const filterJrnls = [
            {
                $match: {
                    //           employeeId: employeeId,
                    dateTime: {
                        $gte: sDate,
                        $lte: eDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        // date: '$dateTime',
                        details: '$details',
                        // employeeId: '$employeeId',
                        // userId: '$userId'
                        // clockType: '$clockType'
                    },
                    documents: { $push: '$$ROOT' }
                }
            },
            { $sort: { time: 1 } }
        ]

        await ConsJrnl.aggregate(filterJrnls).then((result) => {
            if (result === null) {
                console.log(`Consumables Not found for Period starting: ${startDate} and ending ${endDate}`)
            }
            console.log('result =' + JSON.stringify(result))
            consumableDetails = result.map((detail => {
                let sum = 0
                detail.documents.map((doc => {
                    sum = sum + doc.amount
                }))
                ttlActualConsumables = ttlActualConsumables + sum
                return {
                    detailCount: detail.documents.length,
                    detailName: detail._id.details,
                    detailTotal: sum
                }
            }))


        }).catch((error => {
            console.log(`error : Loading Error`)
        }))
        let p = Math.round(((ttlActualConsumables / ttlPlanConsumables) * 100 + Number.EPSILON) * 100) / 100
        let percentConsumables = p ? p : 0


        await EquipJrnl.aggregate(filterJrnls).then((result) => {
            if (result === null) {
                console.log(`Equipment Not found for Period starting: ${startDate} and ending ${endDate}`)
            }
            console.log('result =' + JSON.stringify(result))
            equipmentDetails = result.map((detail => {
                let sum = 0
                detail.documents.map((doc => {
                    sum = sum + doc.amount
                }))
                ttlActualEquipment = ttlActualEquipment + sum
                return {
                    detailCount: detail.documents.length,
                    detailName: detail._id.details,
                    detailTotal: sum
                }
            }))


        }).catch((error => {
            console.log(`error : Loading Error`)
        }))
        p = Math.round(((ttlActualEquipment / ttlPlanEquipment) * 100 + Number.EPSILON) * 100) / 100
        let percentEquipment = p ? p : 0

        await ExpenseJrnl.aggregate(filterJrnls).then((result) => {
            if (result === null) {
                console.log(`Expenses Not found for Period starting: ${startDate} and ending ${endDate}`)
            }
            console.log('result =' + JSON.stringify(result))
            expenseDetails = result.map((detail => {
                let sum = 0
                detail.documents.map((doc => {
                    sum = sum + doc.amount
                }))
                ttlActualExpenses = ttlActualExpenses + sum
                return {
                    detailCount: detail.documents.length,
                    detailName: detail._id.details,
                    detailTotal: sum
                }
            }))

        }).catch((error => {
            console.log(`error : Loading Error`)
        }))
        p = Math.round(((ttlActualExpenses / ttlPlanExpenses) * 100 + Number.EPSILON) * 100) / 100
        let percentExpenses = p ? p : 0

        //----------------------------------------------------------------------------------------------
        return {
            // actLabour,
            "_id": project._id,
            "title": project.title,
            "activities": acts,

            "allLabour_ids": labourIds,
            attendsDetails,
            ttlPlanLabour,
            ttlActualLabour,
            percentLabour,

            "allConsumable_ids": consumableIds,
            consumableDetails,
            ttlActualConsumables,
            ttlPlanConsumables,
            percentConsumables,

            "allEquipment_ids": equipmentIds,
            equipmentDetails,
            ttlActualEquipment,
            ttlPlanEquipment,
            percentEquipment,

            "allExpense_ids": expenseIds,
            expenseDetails,
            ttlActualExpenses,
            ttlPlanExpenses,
            percentExpenses

        }
    }
    )
    ) //all Promise
    response = proj
    res.status(200).json(response)

})
/*****************************************************************************************************
 * 
 *  Get Labour Attendance using post.
 *  1. Employee id
 *  2. start date
 *  3. end date
 * 
 ****************************************************************************************************/
// @desc Get all attends by 

// @route POST /attends/employeeSE
// @access Private
const postHrsByEIdSE = asyncHandler(async (req, res) => {
    const employeeId = req.body.eid
    const startDate = req.body.start
    const endDate = req.body.end
    // [
    //     {
    //         $match: {
    //             employeeId: employeeId,
    //             date: {
    //                 $gte: startDate,
    //                 $lte: endDate
    //             }
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: '$date',
    //             documents: { $push: '$$ROOT' }
    //         }
    //     }
    // ]
    const filter = employeeId ?

        [
            {
                $match: {
                    employeeId: employeeId,
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
        :
        [
            {
                $match: {
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
        // response.attends = result.map((emp) => {
        //     return {
        //         username: emp.employeeName.toLowerCase().replace(/ /g, "_"),
        //         password: emp.employeeName.toLowerCase().replace(/ /g, "_"),
        //         employeeId: emp.employeeId,
        //         employeeName: emp.employeeName,
        //         roles: ["Employee", "Site"],
        //         active: true
        //     }
        // })
    }).catch((error => {
        console.log(`error : Loading Error`)
    }))
    let dts, dte
    let tms, tme

    // response.attends = attends

    response.employeeName = attends[0]?._id?.employeeName
    response.employeeId = attends[0]?._id?.employeeId
    response.userId = attends[0]?._id?.userId
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
    let totalWorkHrs = attendsDetails.reduce(function (prev, current) {
        return prev + +current.workHour
    }, 0);
    response.totalWorkHrs = totalWorkHrs
    response.attendsDetails = attendsDetails
    console.log('dts =' + JSON.stringify(dts))
    console.log('tms =' + JSON.stringify(tms))
    console.log('response =' + JSON.stringify(response))
    res.status(200).json(response)
})

module.exports = {
    getActivitiesByProjs,
    postHrsByEIdSE
}