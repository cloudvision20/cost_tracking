import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [employeeId, setEmployeeId] = useState(user.employeeId)
    const [employeeName, setEmployeeName] = useState(user.employeeName)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmployeeIdChanged = e => setEmployeeId(e.target.value)
    const onEmployeeNameChanged = e => setEmployeeName(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, employeeId, employeeName, password, roles, active })
        } else {
            await updateUser({ id: user.id, username, employeeId, employeeName, roles, active })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    let canSave
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }
    canSave = true
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    // const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="panel">
                    <h4><b>Edit User</b></h4>
                    <div className="form-group  dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="btn btn-danger"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"><b>Employee Id:</b> </div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="employeeId"
                            name="EmployeeId"
                            type="text"
                            autoComplete="off"
                            value={employeeId}
                            onChange={onEmployeeIdChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"><b>Employee Name:</b> </div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="employeeName"
                            name="EmployeeName"
                            type="text"
                            autoComplete="off"
                            value={employeeName}
                            onChange={onEmployeeNameChanged}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2"><b>Username:</b> <br /><span className="user-tip">[3-20 letters]</span>
                    </div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="off"
                            value={username}
                            onChange={onUsernameChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"><b>Password:</b> <br /> <span className="user-tip">[empty = no change]</span><br /><span className="user-tip">  [4-12 chars incl. !@#$%]</span></div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={onPasswordChanged}
                        />
                    </div>
                </div>




                {/* <div className="form-group col-md-2">
                    <label className="form__label form__checkbox-container" htmlFor="user-active">
                        ACTIVE:
                        <input
                            className="form__checkbox"
                            id="user-active"
                            name="user-active"
                            type="checkbox"
                            checked={active}
                            onChange={onActiveChanged}
                        />
                    </label>
                </div> */}
                <div className="form-group row">
                    <div className="col-sm-2"> <b>ACTIVE:</b></div>
                    <div className="col-sm-2 form-check">
                        {/* <div className="form-check"> */}
                        <input
                            className="form-check-input"
                            id="user-active"
                            name="user-active"
                            type="checkbox"
                            checked={active}
                            onChange={onActiveChanged}
                        />
                        {/* </div> */}
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"><b> ASSIGNED ROLES:</b></div>
                    <div className="col-sm-2">
                        <select
                            id="roles"
                            name="roles"
                            className="form-control"
                            multiple={true}
                            size="3"
                            value={roles}
                            onChange={onRolesChanged}
                        >
                            {options}
                        </select>
                    </div>
                </div>




            </form>
        </>
    )

    return content
}
export default EditUserForm