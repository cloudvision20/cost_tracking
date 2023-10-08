const User = require('../models/User')
// const Note = require('../models/DailyReport')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, employeeId, employeeName, contactInfo, roles, active } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles }


    userObject.username = username
    userObject.employeeId = employeeId
    userObject.employeeName = employeeName
    userObject.contactInfo = contactInfo
    userObject.roles = roles
    userObject.active = active

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const saveUser = async (req, res) => {
    const { id, username, employeeId, employeeName, contactInfo, roles, active, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.employeeId = employeeId
    user.employeeName = employeeName
    user.contactInfo = contactInfo
    user.roles = roles
    user.active = active


    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { username, employeeId, employeeName, contactInfo, roles, active, password, currActivityId } = req.body

    let id
    req.body.id ? id = req.body.id
        : req.body._id ? id = req.body._id
            : id = undefined
    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'User Id is required' })
    }

    // Does the user exist to update?
    const userFound = await User.findById(id).exec()

    if (!userFound) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    let user = {}
    if (username) { user.username = username }
    if (employeeId) { user.employeeId = employeeId }
    if (employeeName) { user.employeeName = employeeName }
    if (contactInfo) { user.contactInfo = contactInfo }
    if (roles) { user.roles = roles }
    if (currActivityId) { user.currActivityId = currActivityId }
    if (active) { user.active = active }
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    await User.findOneAndUpdate({ _id: id }, user, { new: true }).then((data) => {
        if (data === null) {
            throw new Error(`User Id: (\'${id}\') not found update failed `);
        }
        res.json({ message: `User Id: (\'${data._id}\'), Username: (\'${data.username}\'), updated successfully` })
    }).catch((error) => {

        res.status(500).json({ message: `error -- User Id: (\'${id}\') update failed`, error: error })
    });
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    try {
        const user = await User.findOneAndDelete({ _id: id });
        if (!user) {
            return res.status(400).json({ message: `User Id: (\'${id}\') not found delete failed ` });
        }
        return res.status(200).json({ message: `User Id: (\'${data._id}\'), Username: (\'${data.username}\'), deleted successfully` });
    } catch (err) {
        return res.status(400).json({ message: `error -- User Id: (\'${id}\') delete failed`, error: err })
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    saveUser,
    updateUser,
    deleteUser
}