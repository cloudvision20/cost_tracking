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
    const { projectId, projectName, roles, contactInfo } = req.body

    // Confirm data
    if (!projectName || !projectId) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate projectName
    const duplicate = await Project.findOne({ projectName }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate projectName' })
    }

    // // Hash password 
    // const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const projectObject = (!Array.isArray(roles) || !roles.length)
        ? { projectId, projectName, contactInfo }
        : { projectId, projectName, contactInfo, roles }

    // Create and store new project 
    const project = await Project.create(projectObject)

    if (project) { //created 
        res.status(201).json({ message: `New project ${projectName} created` })
    } else {
        res.status(400).json({ message: 'Invalid project data received' })
    }
}

// @desc Update a project
// @route PATCH /projects
// @access Private
const updateProject = async (req, res) => {
    const { id, projectId, projectName, roles, active } = req.body

    // Confirm data 
    if (!id || !projectId || !projectName || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the project exist to update?
    const project = await Project.findById(id).exec()

    if (!project) {
        return res.status(400).json({ message: 'Project not found' })
    }

    // Check for duplicate 
    const duplicate = await Project.findOne({ projectName }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original project 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate projectName' })
    }
    project.projectId = projectId
    project.projectName = projectName
    project.contactInfo = req.body.contactInfo
    project.roles = roles
    project.active = active

    // if (password) {
    //     // Hash password 
    //     project.password = await bcrypt.hash(password, 10) // salt rounds 
    // }

    const updatedProject = await project.save()

    res.json({ message: `${updatedProject.projectName} updated` })
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

    const reply = `ProjectName ${result.projectName} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllProjects,
    createNewProject,
    updateProject,
    deleteProject
}