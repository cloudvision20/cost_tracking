import { useState, useEffect } from "react"
import { useAddNewConsumableMutation } from "./consumablesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
// import { TYPE } from "../../config/type"
import useTitle from "../../hooks/useTitle"
const TYPE = []
const CONSUMABLE_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewConsumableForm = () => {
    useTitle('Cost Tracking: New Consumable')

    const [addNewConsumable, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewConsumableMutation()

    const navigate = useNavigate()

    const [details, setDetails] = useState('')
    const [validDetails, setValidDetails] = useState(false)
    const [job, setJob] = useState('')
    const [validJob, setValidJob] = useState(false)
    const [type, setType] = useState('')
    const [employeeId, setEmployeeId] = useState('')
    const [terminal, setTerminal] = useState('')

    useEffect(() => {
        // setValidDetails(CONSUMABLE_REGEX.test(details))
        setValidDetails(true)
    }, [details])

    useEffect(() => {
        // setValidJob(PWD_REGEX.test(job))
        setValidJob(true)
    }, [job])

    useEffect(() => {
        if (isSuccess) {
            setDetails('')
            setJob('')
            setEmployeeId('')
            setTerminal('')
            setType([])
            navigate('/dash/consumables')
        }
    }, [isSuccess, navigate])

    const onDetailsChanged = e => setDetails(e.target.value)
    const onJobChanged = e => setJob(e.target.value)
    const onEmployeeIdChanged = e => setEmployeeId(e.target.value)
    const onTerminalChanged = e => setTerminal(e.target.value)
    const onTypeChanged = e => setType(e.target.value)
    const onTypeChanged1 = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setType(values)
    }

    const canSave = [type.length, validDetails, validJob].every(Boolean) && !isLoading

    const onSaveConsumableClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewConsumable({ details, job, employeeId, terminal, type })
        }
    }

    const options = Object.values(TYPE).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    // const validConsumableClass = !validDetails ? 'form__input--incomplete' : ''
    // const validPwdClass = !validJob ? 'form__input--incomplete' : ''
    // const validTypeClass = !Boolean(type.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form onSubmit={onSaveConsumableClicked}>
                <div className="panel ">
                    <h4><b>New Consumable</b></h4>
                    <div className="form-group dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveConsumableClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
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
                    <div className="col-sm-2"><b>Type:</b> <br /> <span className="consumable-tip">[empty = no change]</span><br /><span className="consumable-tip">  [4-12 chars incl. !@#$%]</span></div>
                    <div className="col-sm-2">
                        <input
                            className="form-control"
                            id="job"
                            name="job"
                            type="job"
                            value={type}
                            onChange={onTypeChanged}
                        />
                    </div>
                </div>
                {/* 
                <div className="form-group row">
                    <div className="col-sm-2"><b> Consumable TYPE:</b></div>
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
                </div> */}

            </form>
        </>
    )

    return content
}
export default NewConsumableForm