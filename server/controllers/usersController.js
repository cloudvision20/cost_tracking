const User = require('../models/User')
// const Note = require('../models/DailyReport')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').populate({ path: 'currActivityId', select: 'name' }).lean()

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
    const { username, password, employeeId, employeeName, currActivityId, contactInfo, roles, active } = req.body

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
    userObject.currActivityId = currActivityId
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
    const { id, username, employeeId, employeeName, currActivityId, contactInfo, roles, active, password } = req.body

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
    user.currActivityId = currActivityId
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
    const { username, employeeId, employeeName, currActivityId, contactInfo, roles, active, password } = req.body

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


// // @desc Update a user
// // @route PATCH /users
// // @access Private
const updateUsers = async (req, res) => {
    const newData = req.body.data
    //const formType = req.body.formType
    //const formName = !formType ? 'User' : formType
    const response = []
    const data = []
    let user
    let newUser
    for (let i = 0; i < newData.length; i++) {
        user = {}
        let roles = []
        let contactInfo = []
        let id = newData[i].id ? newData[i].id
            : newData[i]._id ? newData[i]._id
                : undefined

        // Hash password 
        if (newData[i].username !== undefined) { user.username = newData[i].username }
        if (newData[i].password !== undefined) { user.password = await bcrypt.hash(newData[i].password, 10) }
        if (newData[i].employeeId !== undefined) { user.employeeId = newData[i].employeeId }
        if (newData[i].employeeName !== undefined) { user.employeeName = newData[i].employeeName }

        if (newData[i].contactInfo) {
            contactInfo = newData[i].contactInfo
            user.contactInfo = contactInfo
        }
        if (newData[i].roles) {
            roles = newData[i].roles
            user.roles = roles
        }
        if (newData[i]?.currActivityId !== undefined) {
            user.currActivityId = newData[i].currActivityId
        }
        if (newData[i].active) {
            user.active = newData[i].active
        }


        if (id) {
            // Update
            user._id = id
            await User.findOneAndUpdate({ _id: id }, user, { new: true }).then((result) => {
                if (result === null) {
                    response.push({ message: `User Id: ${id} not found update failed` })
                } else {
                    response.push({ message: `User Id: ${result._id} updated successfully` })
                    data.push(result)
                }
            }).catch((error) => {
                response.push({ message: `error -- User Id: (\'${id}\') update failed , error: ${error}` })
            });
        } else {
            //create 
            await User.create(user)
                .then((result) => {
                    if (result === null) {
                        response.push({ message: `Employee Name: ${user.employeeName}, fail to create new user` })
                    } else {
                        response.push({ message: `User Id: ${result._id} created successfully` })
                        data.push(result)
                    }
                }
                )
                .catch(
                    (error) => {
                        console.log(`error=${error}`)
                        console.log(`Employee Name: ${user.employeeName},` + error)
                        response.push({ message: `error -- Employee Name: ${user.employeeName} create failed , error: ${error}` })
                    }
                )
        }
    }
    // console.log(`response = ${JSON.stringify(response)}`)
    // console.log(`data = ${JSON.stringify(data)}`)
    // let result = {}
    // result.data = data
    // result.response = response

    return res.status(202).json({ data: data, response })
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
        const data = await User.findOneAndDelete({ _id: id });
        if (!data) {
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
    updateUsers,
    deleteUser
}