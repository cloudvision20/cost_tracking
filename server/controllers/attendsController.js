const Attend = require('../models/Attendance')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const dateFns = require('date-fns')

// @desc Get all attends
// @route GET /attends
// @access Private
const getAllAttends = asyncHandler(async (req, res) => {
    const formType = req.params.type

    let response = {}
    await Attend.find().lean().then((result) => {
        if (result === null) {
            console.log(`Attendance data not found`)
        }
        // console.log('result =' + JSON.stringify(result))
        response.attends = result
    }).catch((error => {
        // console.log(`error : Loading Error`)
    }))


    console.log('response =' + JSON.stringify(response))
    res.status(200).json(response)

})
// get distinct employee Id and Employee Name by aggregate from attendance
const getEmployeeByAggregate = asyncHandler(async (req, res) => {
    const filter = [
        {
            $group: {
                _id: "$employeeId",
                employeeName: { $first: "$employeeName" }
            }
        },
        {
            $project: {
                _id: 0,
                employeeId: "$_id",
                employeeName: 1
            }
        }
    ]
    let response = {}
    // await Attend.find().distinct('employeeId').then((result) => {
    //     if (result === null) {
    //         console.log(`Attendance data not found`)
    //     }
    //     console.log('result =' + JSON.stringify(result))
    //     response.attends = result
    // }).catch((error => {
    //     console.log(`error : Loading Error`)
    // }))
    await Attend.aggregate(filter).then((result) => {
        if (result === null) {
            console.log(`Attendance data not found`)
        }
        console.log('result =' + JSON.stringify(result))
        response.attends = result.map((emp) => {
            return {
                username: emp.employeeName.toLowerCase().replace(/ /g, "_"),
                password: emp.employeeName.toLowerCase().replace(/ /g, "_"),
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                roles: ["Employee", "Site"],
                active: true
            }
        })
    }).catch((error => {
        console.log(`error : Loading Error`)
    }))


    console.log('response =' + JSON.stringify(response))
    res.status(200).json(response)


})
// @desc Get all attends by Employee id
// @route GET /attends
// @access Private
const getAllAttendsByEId = asyncHandler(async (req, res) => {
    const employeeId = req.params.eid

    let response = {}
    await Attend.find({ employeeId }).lean().then((result) => {
        if (result === null) {
            console.log(`EmployeeId:${employeeid} attend not found`)
        }
        console.log('result =' + JSON.stringify(result))
        response.attends = result
    }).catch((error => {
        console.log(`error :  Loading Error`)
    }))


    console.log('response =' + JSON.stringify(response))
    res.status(200).json(response)
})
// @desc Get all attends by 
// 1. Employee id
// 2. start date
// 3. end date
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
    const filter = [
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

    //response.attends = attends
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

// @desc Get all attends by 
// WorkWork in Progress
// 1.Project
// 2. start date
// 3. end date
// @route POST /attends/employeeSE
// @access Private
const postAllHrsByProj = asyncHandler(async (req, res) => {
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
    const filter = [
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

    //response.attends = attends
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

// @desc test attendance aggregate
// @route get /attends/filterdate
// @access Private
const getFilterDate = asyncHandler(async (req, res) => {

    let response = {}
    let attends = {}
    const filter =
        [
            // {
            //     $match: {
            //         employeeId: employeeId,
            //         date: {
            //             $gte: startDate,
            //             $lte: endDate
            //         }
            //     }
            // },
            // {
            //     $group: {
            //         _id: '$employeeId',

            //         documents: { $push: '$$ROOT' }
            //     }
            // }
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

    await Attend.aggregate(filter).then((result) => {
        if (result === null) {
            console.log(`Attendance data not found`)
        }
        attends = result
        // console.log('result =' + JSON.stringify(result))
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
    // await Attend.find().lean().then((result) => {
    //     if (result === null) {
    //         console.log(`Attendance data not found`)
    //     }
    //     // console.log('result =' + JSON.stringify(result))
    //     attends = result
    // }).catch((error => {
    //     // console.log(`error : Loading Error`)
    // }))
    let dt, tm

    // response.employeeName = attends[0]?._id?.employeeName
    // response.employeeId = attends[0]?._id?.employeeId
    // response.userId = attends[0]?._id?.userId
    const attendsDetails = attends.map((att) => {
        if (att.documents.length > 1) {
            const times = att.documents[att.documents.length - 1].datetime
            const timee = att.documents[0].datetime

            const diff = Math.abs(dateFns.differenceInMinutes(times, timee))
            return {


                // newTime: çnew Date(dts[2], dts[1], dts[0], tms[1], tms[0]),
                // new0Time: new Date(parseInt(dts[2]), parseInt(dts[1]), parseInt(dts[0]), parseInt(tms[1]), parseInt(tms[0])),
                //new1Time: timee.toLocaleString(),
                //tstTime: dateFns.parseJSON(new Date()),
                employeeId: att._id.employeeId,
                employeeName: att._id.employeeName,
                inTime: times.toLocaleString(),
                outTime: timee.toLocaleString(),
                diff: diff,
                hrDiff: parseInt(diff / 60),//Math.floor(dateFns.differenceInMinutes(times, timee) / 60),
                minDiff: diff % 60,
                workHour: parseInt(diff / 60) - 1
                // consolelogdts: JSON.stringify(dts),
                // consolelogtms: JSON.stringify(tms),
            }
        }
    })
    // Attend.update({}, { $unset: { dateTime: 1 } }, false, true);
    // await Attend.find().lean().then((result) => {
    //     if (result === null) {
    //         console.log(`Attendance data not found`)
    //     }
    //     // console.log('result =' + JSON.stringify(result))
    //     response.attends = result
    // }).catch((error => {
    //     // console.log(`error : Loading Error`)
    // }))
    response.attends = attends
    res.status(200).json(attendsDetails)
})

// // @desc Update a attend
// // @route PATCH /attends
// // @access Private
const updateAttends = async (req, res) => {
    const newData = req.body.data
    //const formType = req.body.formType
    //const formName = !formType ? 'Attend' : formType
    const response = []
    const data = []
    let attend
    for (let i = 0; i < newData.length; i++) {
        attend = new Attend()

        attend.userId = newData[i].userId ? newData[i].userId : null
        attend.employeeId = newData[i].employeeId ? newData[i].employeeId : null
        attend.employeeName = newData[i].employeeName ? newData[i].employeeName : null

        attend.clockType = newData[i].clockType ? newData[i].clockType : null
        attend.date = newData[i].date ? newData[i].date : null
        attend.time = newData[i].time ? newData[i].time : null
        attend.weekday = newData[i].weekday ? newData[i].weekday : null

        attend.datetime = newData[i].datetime ? newData[i].datetime : null
        attend.terminal = newData[i].terminal ? newData[i].terminal : null

        if (newData[i]._id) {
            // Update
            attend._id = newData[i]._id
            await Attend.findOneAndUpdate({ _id: newData[i]._id }, attend, { new: true }).then((result) => {
                if (result === null) {
                    response.push({ message: `Attendance Id: : ${newData[i]._id} not found update failed` })
                } else {
                    response.push({ message: `Attendance Id: ${result._id} updated successfully` })
                    data.push(result)
                }
            }).catch((error) => {
                response.push({ message: `error -- Attendance Id: (\'${newData[i]._id}\') update failed , error: ${error}` })
            });
        } else {
            //create 
            await attend.save()
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Attendance Id: ${newData[i]._id}, fail to saved` })
                    } else {
                        response.push({ message: `Attendance Id: ${result._id} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`error=${error}`)
                        console.log(`id: ${newData[i]._id},` + error)
                        response.push({ message: `error -- Attendance Id: (\'${data._id}\') create failed , error: ${error}` })
                    }
                )
        }
    }
    console.log(`response = ${JSON.stringify(response)}`)
    console.log(`data = ${JSON.stringify(data)}`)
    // let result = {}
    // result.data = data
    // result.response = response

    return res.status(202).json({ data: data, response })
}
// @desc Delete a attend
// @route DELETE /attends
// @access Private
const deleteAttend = async (req, res) => {
    const { id } = req.body.del
    // const formName = !formType ? 'Attend' : formType

    if (!formType) { return res.status(400).json({ message: `Attendance ID Required` }) }
    if (!id) { return res.status(400).json({ message: `Attendance ID Required` }) }
    try {
        const data = await Attend.findOneAndDelete({ _id: id })
        if (!data) {
            return res.status(400).json({ message: `Attendance  Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ data: data, message: `Attendance  Id: (\'${data._id}\'), Details: (\'${data.details}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Attendance  Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllAttends,
    getEmployeeByAggregate, // getEmployee
    getAllAttendsByEId, // By EmployeeID
    getFilterDate,
    postHrsByEIdSE,
    updateAttends,
    deleteAttend
}