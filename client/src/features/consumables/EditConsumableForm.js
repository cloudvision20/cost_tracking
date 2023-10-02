import { useState, useEffect } from "react"
import { useUpdateConsumableMutation, useDeleteConsumableMutation } from "./consumablesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
// import { TYPE } from "../../config/type"
const TYPE = []
const CONSUMABLE_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditConsumableForm = ({ consumable }) => {

    const [updateConsumable, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateConsumableMutation()

    const [deleteConsumable, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteConsumableMutation()

    const navigate = useNavigate()

    const [details, setDetails] = useState(consumable.details)
    const [validDetails, setValidDetails] = useState(false)
    const [job, setJob] = useState('')
    const [validJob, setValidJob] = useState(false)
    const [employeeId, setEmployeeId] = useState(consumable.employeeId)
    const [terminal, setTerminal] = useState(consumable.terminal)
    const [type, setType] = useState(consumable.type)
    //const [active, setActive] = useState(consumable.active)

    useEffect(() => {
        // setValidDetails(CONSUMABLE_REGEX.test(details))
        setValidDetails(true)
    }, [details])

    useEffect(() => {
        //setValidJob(PWD_REGEX.test(job))
        setValidJob(true)
    }, [job])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setDetails('')
            setJob('')
            setType([])
            navigate('/dash/consumables')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onDetailsChanged = e => setDetails(e.target.value)
    const onJobChanged = e => setJob(e.target.value)
    const onEmployeeIdChanged = e => setEmployeeId(e.target.value)
    const onTerminalChanged = e => setTerminal(e.target.value)

    const onTypeChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setType(values)
    }

    //const onActiveChanged = () => setActive(prev => !prev)

    const onSaveConsumableClicked = async (e) => {
        if (job) {
            await updateConsumable({ id: consumable.id, details, employeeId, terminal, job, type })
        } else {
            await updateConsumable({ id: consumable.id, details, employeeId, terminal, type })
        }
    }

    const onDeleteConsumableClicked = async () => {
        await deleteConsumable({ id: consumable.id })
    }

    const options = Object.values(TYPE).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    let canSave
    if (job) {
        canSave = [type.length, validDetails, validJob].every(Boolean) && !isLoading
    } else {
        canSave = [type.length, validDetails].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    // const validConsumableClass = !validDetails ? 'form__input--incomplete' : ''
    // const validPwdClass = job && !validJob ? 'form__input--incomplete' : ''
    // const validTypeClass = !Boolean(type.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="panel">
                    <h4><b>Edit Consumable</b></h4>
                    <div className="form-group  dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveConsumableClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="btn btn-danger"
                            title="Delete"
                            onClick={onDeleteConsumableClicked}
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
                    <div className="col-sm-2"><b>Terminal:</b> </div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="terminal"
                            name="Terminal"
                            type="text"
                            autoComplete="off"
                            value={terminal}
                            onChange={onTerminalChanged}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2"><b>Details:</b> <br /><span className="consumable-tip">[3-20 letters]</span>
                    </div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="details"
                            name="details"
                            type="text"
                            autoComplete="off"
                            value={details}
                            onChange={onDetailsChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"><b>Job:</b> <br /> <span className="consumable-tip">[empty = no change]</span><br /><span className="consumable-tip">  [4-12 chars incl. !@#$%]</span></div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="job"
                            name="job"
                            type="job"
                            value={job}
                            onChange={onJobChanged}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2"><b> Consumable Type:</b></div>
                    <div className="col-sm-2">
                        <select
                            id="type"
                            name="type"
                            className="form-control"
                            multiple={true}
                            size="3"
                            value={type}
                            onChange={onTypeChanged}
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
export default EditConsumableForm