import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const inputStyle = { fontSize: "12px", textAlign: "left" }

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
    const isNewUser = (user?._id) ? false : true
    const [username, setUsername] = useState(user?.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [employeeId, setEmployeeId] = useState(user?.employeeId)
    const [employeeName, setEmployeeName] = useState(user?.employeeName)
    const [roles, setRoles] = useState(user?.roles)
    const [active, setActive] = useState(user?.active)
    const [email, setEmail] = useState(user?.contactInfo?.email)
    const [phone, setPhone] = useState(user?.contactInfo?.phone)
    const [whatsapp, setWhatsapp] = useState(user?.contactInfo?.whatsapp)
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
    const onEmailChanged = e => setEmail(e.target.value)
    const onPhoneChanged = e => setPhone(e.target.value)
    const onWhatsappChanged = e => setWhatsapp(e.target.value)
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        let contactInfo = {}
        contactInfo.email = email
        contactInfo.phone = phone
        contactInfo.whatsapp = whatsapp
        if (password) {
            await updateUser({ _id: user.id, id: user.id, username, employeeId, employeeName, password, roles, active, contactInfo })
        } else {
            await updateUser({ _id: user.id, id: user.id, username, employeeId, employeeName, roles, active, contactInfo })
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
                <div className="container grid_system" style={{ fontSize: '12px', border: "1px solid blue", padding: " 10px 10px 10px 10px" }}>

                    <div className=" row" style={{ paddingBottom: "20px" }}>
                        <div className="col-sm-10" style={{ fontSize: '12px', border: "0px" }}>
                            <h5><b>{(isNewUser ? 'Create New' : 'Edit')} User</b></h5>
                        </div>
                        <div className=" col-sm-2  ct-header__nav" >
                            <button
                                className="btn btn-primary btn-sm"
                                title="Save"
                                onClick={onSaveUserClicked}
                                disabled={!canSave}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                title="Delete"
                                onClick={onDeleteUserClicked}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>
                    <div className=" row" >
                        <div className=" col-sm-3" ><b>Employee Id:</b> </div>
                        <div className=" col-sm-4" >
                            <input
                                className="form-control"
                                id="employeeId"
                                name="EmployeeId"
                                style={inputStyle}
                                type="text"
                                autoComplete="off"
                                value={employeeId}
                                onChange={onEmployeeIdChanged}
                            />
                        </div>
                    </div>
                    <div className=" row" >
                        <div className=" col-sm-3" ><b>Employee Name:</b> </div>
                        <div className=" col-sm-4" >
                            <input
                                className="form-control"
                                id="employeeName"
                                name="EmployeeName"
                                style={inputStyle}
                                type="text"
                                autoComplete="off"
                                value={employeeName}
                                onChange={onEmployeeNameChanged}
                            />
                        </div>
                    </div>

                    <div className=" row" >
                        <div className=" col-sm-3" ><b>Username:</b> <br />
                            <span className="user-tip">[3-20 letters]</span>
                        </div>
                        <div className=" col-sm-4" >
                            <input
                                className="form-control"
                                id="username"
                                name="username"
                                style={inputStyle}
                                type="text"
                                autoComplete="off"
                                value={username}
                                onChange={onUsernameChanged}
                            />
                        </div>
                    </div>
                    <div className=" row" >
                        <div className=" col-sm-3" ><b>Password:</b> <br /> <span className="user-tip">[empty = no change]</span><br /><span className="user-tip">  [4-12 chars incl. !@#$%]</span></div>
                        <div className=" col-sm-4" >
                            <input
                                className="form-control"
                                id="password"
                                name="password"
                                style={inputStyle}
                                type="password"
                                value={password}
                                onChange={onPasswordChanged}
                            />
                        </div>
                    </div>
                    {/* Contact Info  */}
                    <div className=" row"  >
                        <div className=" col-sm-3" >
                            <b>ContactInfo:</b>
                        </div>
                        <div className=" col-sm-8">

                            <div className=" row" >
                                <div className=" col-sm-2" ><b>Email:</b>
                                </div>
                                <div className=" col-sm-4" >
                                    <input
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        style={inputStyle}
                                        type="text"
                                        autoComplete="off"
                                        value={email}
                                        onChange={onEmailChanged}
                                    />
                                </div>
                            </div>
                            <div className=" row" >
                                <div className=" col-sm-2" ><b>Phone:</b>
                                </div>
                                <div className=" col-sm-4" >
                                    <input
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        style={inputStyle}
                                        type="text"
                                        autoComplete="off"
                                        value={phone}
                                        onChange={onPhoneChanged}
                                    />
                                </div>
                            </div>
                            <div className=" row" >
                                <div className=" col-sm-2" ><b>Whatsapp:</b>
                                </div>
                                <div className=" col-sm-4" >
                                    <input
                                        className="form-control"
                                        id="whatsapp"
                                        name="whatsapp"
                                        style={inputStyle}
                                        type="text"
                                        autoComplete="off"
                                        value={whatsapp}
                                        onChange={onWhatsappChanged}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" row" >
                        <div className=" col-sm-3" > <b>ACTIVE:</b>
                        </div>
                        <div className=" col-sm-4 form-check" >
                            <input
                                className="form-check-input"
                                id="user-active"
                                name="user-active"
                                type="checkbox"
                                checked={active}
                                onChange={onActiveChanged}
                            />
                        </div>
                    </div>
                    <div className="row" >
                        <div className=" col-sm-3" ><b> ASSIGNED ROLES:</b>
                            <br />
                            <span className="user-tip">{roles.toString().replaceAll(',', ', ')}</span>
                        </div>
                        <div className=" col-sm-4" >
                            <select
                                id="roles"
                                name="roles"
                                className="form-check"
                                style={{ fontSize: "12px", width: "100%", textAlign: "left" }}
                                multiple={true}
                                size="3"
                                value={roles}
                                onChange={onRolesChanged}
                            >
                                {options}
                            </select>
                        </div>
                    </div>



                </div>
            </form>
        </>
    )

    return content
}
export default EditUserForm