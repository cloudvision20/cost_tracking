const Project = require('../models/Project')
const Note = require('../models/DailyReport')
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

    // // Hash password 
    // const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    // const projectObject = (!Array.isArray(roles) || !roles.length)
    //     ? { userId, title, contactInfo }
    //     : { userId, title, contactInfo, roles }

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
const updateProject = async (req, res) => {
    // const { id, projectId, title, roles, active } = req.body
    const id = req.body._id
    // // Confirm data 
    // if (!id || !projectId || !title || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    //     return res.status(400).json({ message: 'All fields except password are required' })
    // }

    // Does the project exist to update?
    const project = await Project.findById(id).exec()

    if (!project) {
        return res.status(400).json({ message: 'Project not found' })
    }

    // Check for duplicate 
    //const duplicate = await Project.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original project 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate title' })
    // }
    project.userId = req.body.userId
    project.title = req.body.title
    project.description = req.body.description
    project.startDate = req.body.startDate
    project.endDate = req.body.endDate
    project.completed = req.body.completed

    // if (password) {
    //     // Hash password 
    //     project.password = await bcrypt.hash(password, 10) // salt rounds 
    // }

    const updatedProject = await project.save()

    res.json({ message: `${updatedProject.title} updated` })
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

    // Does the project still have assigned notes?
    const note = await Note.findOne({ project: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Project has assigned notes' })
    }

    // Does the project exist to delete?
    const project = await Project.findById(id).exec()

    if (!project) {
        return res.status(400).json({ message: 'Project not found' })
    }

    const result = await project.deleteOne()

    const reply = `Title ${result.title} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllProjects,
    createNewProject,
    updateProject,
    deleteProject
}