const Attend = require('../models/Attendance')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

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
        console.log('result =' + JSON.stringify(result))
        response.attends = result
    }).catch((error => {
        console.log(`error : Loading Error`)
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
// @desc Get all attends
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
    updateAttends,
    deleteAttend
}