import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    useTitle('Cost Tracking: New User')

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])
    const [employeeId, setEmployeeId] = useState('')
    const [employeeName, setEmployeeName] = useState('')

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setEmployeeId('')
            setEmployeeName('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmployeeIdChanged = e => setEmployeeId(e.target.value)
    const onEmployeeNameChanged = e => setEmployeeName(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setRoles(values)
    }

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, employeeId, employeeName, roles })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    // const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form onSubmit={onSaveUserClicked}>
                <div className="panel ">
                    <h2>New User</h2>
                    <div className="form-group form__action-buttons">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="username">
                        Username: <span className="nowrap">[3-20 letters]</span></label>
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
                <div className="form-group col-md-4">
                    <label htmlFor="password">
                        Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                    <input
                        className="form-control"
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={onPasswordChanged}
                    />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="employeeId">
                        Employee Id: </label>
                    <input
                        className="form-control"
                        id="employeeId"
                        name="employeeId"
                        type="text"
                        autoComplete="off"
                        value={employeeId}
                        onChange={onEmployeeIdChanged}
                    />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="employeeName">
                        Employee Name: </label>
                    <input
                        className="form-control"
                        id="employeeName"
                        name="employeeName"
                        type="text"
                        autoComplete="off"
                        value={employeeName}
                        onChange={onEmployeeNameChanged}
                    />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="roles">
                        ASSIGNED ROLES:</label>
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
            </form>
        </>
    )

    return content
}
export default NewUserForm