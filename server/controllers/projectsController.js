const Project = require('../models/Project')
const Activity = require('../models/Activity')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all projects
// @route GET /projects
// @access Private
const getAllProjects = async (req, res) => {
    // Get all projects from MongoDB
    const projects = await Project.find() //.select('-password').lean()
    // If no projects 
    if (!projects?.length) {
        return res.status(400).json({ message: 'No projects found' })
    }
    res.json(projects)
}

// @desc Get all projects
// @route GET /projects
// @access Private
const getProjectById = asyncHandler(async (req, res) => {
    const id = req.params.id

    // retrieve Project by Id and include usename corresponsing to userId
    let project = await Project.find({ "_id": id }).populate({ path: 'userId', select: 'username' }).exec()
    let users
    let activities

    // If no project 
    if (!project?.length) {
        return res.status(400).json({ message: `Project id: ${id} not found` })
    } else {
        // options
        users = (await User.find().select("_id, username"))
        activities = await Activity.find({ "projectId": id }).populate({ path: 'userId', select: 'username' }).exec()
    }

    let response = {}

    response.project = project
    response.users = users
    response.activities = activities
    res.json(response)
})



// @desc Create new project
// @route POST /projects
// @access Private
const createNewProject = async (req, res) => {
    const { userId, title } = req.body

    // Confirm data
    if (!title || !userId) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Project.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' })
    }

    // Create and store new project 
    const project = await Project.create(req.body)

    if (project) { //created 
        res.status(201).json({ message: `New project ${title} created` })
    } else {
        res.status(400).json({ message: 'Invalid project data received' })
    }
}

// @desc Update a project
// @route PATCH /projects
// @access Private
const update_Project = async (req, res) => {
    let id = req.body.id ? req.body.id
        : req.body._id ? req.body._id
            : undefined

    // Does the project exist to update?
    let project = await Project.findById(id).exec()

    if (!project) {
        return res.status(400).json({ message: 'Project not found' })
    }

    await Project.findOneAndUpdate({ _id: id }, req.body, { new: true }).then((data) => {
        if (data === null) {
            throw new Error(`Project Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `Project Id: (\'${data._id}\'), Project (title: \'${data.title}\')   updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- Project Id: (\'${id}\') update failed`, error: error })
    });
}

const updateProject = async (req, res) => {
    const newData = req.body
    const response = []
    const data = []
    // let project
    // for (let i = 0; i < newData.length; i++) {
    let project = {}
    let png = []
    let budgetTotals = []
    let contacts = []
    let id = newData.id ? newData.id
        : newData._id ? newData._id.toString()
            : undefined

    // Hash password 
    if (newData.title !== undefined) { project.title = newData.title }
    if (newData.userId !== undefined) { project.userId = newData.userId }
    if (newData.description !== undefined) { project.description = newData.description }
    if (newData.uom !== undefined) { project.uom = newData.uom }
    if (newData.startDate !== undefined) { project.startDate = newData.startDate }
    if (newData.endDate !== undefined) { project.endDate = newData.endDate }
    if (newData.png) {
        png = newData.png
        project.png = png
    }
    if (newData.budgetTotals) {
        budgetTotals = newData.budgetTotals
        project.budgetTotals = budgetTotals
    }
    if (newData.contacts) {
        contacts = newData.contacts
        project.contacts = contacts
    }
    if (newData.completed) {
        project.completed = newData.completed
    }


    if (id) {
        // Update
        project._id = id
        await Project.findOneAndUpdate({ _id: id }, project, { new: true }).then((result) => {
            if (result === null) {
                response.push({ message: `Project Id: ${id} not found update failed` })
            } else {
                response.push({ message: `Project Id: ${result._id} updated successfully` })
                data.push(result)
            }
        }).catch((error) => {
            response.push({ message: `error -- Project Id: (\'${id}\') update failed , error: ${error}` })
        });
    } else {
        //create 
        await Project.create(project)
            .then((result) => {
                if (result === null) {
                    response.push({ message: `Project Title: ${project.title}, fail to create new project` })
                } else {
                    response.push({ message: `Project Id: ${result._id} created successfully` })
                    data.push(result)
                }
            }
            )
            .catch(
                (error) => {
                    console.log(`Project Title: ${project.title}, error =` + error)
                    response.push({ message: `error -- Project Title: ${project.title} create failed , error: ${error}` })
                }
            )
    }
    // }
    console.log(`response = ${JSON.stringify(response)}`)
    console.log(`data = ${JSON.stringify(data)}`)
    return res.status(202).json({ data: data, response })
}



// @desc Delete a project
// @route DELETE /projects
// @access Private
const deleteProject = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Project ID Required' })
    }

    try {
        const data = await Project.findOneAndDelete({ _id: id });
        if (!data) {
            return res.status(400).json({ message: `Project Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `Project Id: (\'${data._id}\'), Project (title: \'${data.title}\')  deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- Project Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllProjects,
    getProjectById,
    createNewProject,
    updateProject,
    deleteProject
}