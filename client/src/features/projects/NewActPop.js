import { useState } from "react"
import { useAddNewActivityMutation, useUpdateActivityMutation, useDeleteActivityMutation } from "../activities/activitiesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FormControl, Form } from 'react-bootstrap';
import { dateForPicker, dateFromDateString } from "../../hooks/useDatePicker"

const NewActPop = ({ userId, projectId, toggle }) => {


    const [addNewActivity, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewActivityMutation()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [completed, setCompleted] = useState(false)
    // const [userId, setUserId] = useState(usersId)
    // const [projectId, setProjectId] = useState(projectId)
    const [processUOM, setProcessUOM] = useState('')
    const [processQuantity, setProcessQuantity] = useState('')
    const [durationUOM, setDurationUOM] = useState('')
    const [durationQuantity, setDurationQuantity] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const onNameChanged = (e) => setName(e.target.value)
    const onDescriptionChanged = (e) => setDescription(e.target.value)
    const onProcessUOMChanged = (e) => setProcessUOM(e.target.value)
    const onProcessQuantityChanged = (e) => setProcessQuantity(e.target.value)
    const onDurationUOMChanged = (e) => setDurationUOM(e.target.value)
    const onDurationQuantityChanged = (e) => setDurationQuantity(e.target.value)

    const onStartDateChanged = (e) => setStartDate(e.target.value)
    const onEndDateChanged = (e) => setEndDate(e.target.value)

    // function handleLogin(e) {
    //     e.preventDefault()
    //     // Code to handle login goes here
    //     // props.toggle()
    // }
    const clearForm = () => {
        setName('')
        setDescription('')
        setProcessUOM('')
        setProcessQuantity('')
        setDurationQuantity('')
        setDurationUOM('')
        setStartDate('')
        setEndDate('')

    }
    const onSaveActivityClicked = async (e) => {
        let eActivity = {}
        let process = {}
        let duration = {}
        e.preventDefault()
        // if (canSave) {
        eActivity.name = name
        eActivity.description = description
        eActivity.startDate = startDate ? startDate : ''
        eActivity.endDate = endDate ? endDate : ''
        eActivity.completed = completed
        eActivity.userId = userId
        eActivity.projectId = projectId
        process.uom = processUOM ? processUOM : ''
        process.quantity = processQuantity ? processQuantity : 0
        eActivity.process = process
        duration.uom = durationUOM ? durationUOM : ''
        duration.quantity = durationQuantity ? durationQuantity : 0
        eActivity.duration = duration
        // eActivity.resources = rowData
        console.log(eActivity)
        console.log(JSON.stringify(eActivity))
        await addNewActivity(eActivity).then((result) => {
            // props.toggle()
            // console.log('New activity creation success ' + JSON.stringify(result))
        })
        // }
    }
    if (isSuccess) {
        clearForm()
        toggle()
    }
    return (
        <div className="container grid_system" style={{ fontSize: '11px', border: "1px solid lightgray" }}>
            <form onSubmit={e => e.preventDefault()}>
                <br />
                <div className="form-group row" style={{ border: "0px" }}>
                    <div className="col-sm-10" style={{ border: "0px" }}><b>Add New Activity</b></div>
                    <div className="col-sm-2 " style={{ border: "0px", paddingBottom: "10px", paddingRight: "35px" }} >

                        <div className="form-group ct-header__nav">
                            <button
                                className="btn btn-primary btn-sm"
                                title="Save"
                                onClick={onSaveActivityClicked}
                            //disabled={!canSave}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container grid_system_no_border" style={{ fontSize: '11px' }}>
                    <div className="row">
                        <div className=" col-sm-6">
                            <div className="container-fluid" style={{ border: "0px" }}>
                                <div className="form-group row">
                                    <div className=" col-sm-2"><b>Name:</b></div>
                                    <div className=" col-sm-10">
                                        <input
                                            className="form-control"
                                            id="activity-name"
                                            name="Name"
                                            type="text"
                                            placeholder="Name"
                                            autoComplete="off"
                                            style={{ fontSize: '11px' }}
                                            value={name}
                                            onChange={onNameChanged}
                                        />
                                    </div>

                                </div>
                                <div className="form-group row">
                                    <div className=" col-sm-2"><b>Description:</b></div>
                                    <div className=" col-sm-10">
                                        <textarea
                                            className="form-control"
                                            id="activity-description"
                                            name="description"
                                            rows="3"
                                            style={{ fontSize: '11px' }}
                                            value={description}
                                            onChange={onDescriptionChanged}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" col-sm-6">
                            <div className="container-fluid" style={{ border: "0px" }}>
                                <div className="form-group row">
                                    <div className=" col-sm-2"><b>Activity Process:</b></div>
                                    <div className=" col-sm-5">
                                        <input
                                            className="form-control"
                                            id="process-unit"
                                            name="process-unit"
                                            type="text"
                                            placeholder="Process Unit"
                                            autoComplete="off"
                                            style={{ fontSize: '11px' }}
                                            value={processUOM}
                                            onChange={onProcessUOMChanged}
                                        />
                                    </div>
                                    <div className=" col-sm-5">
                                        <input
                                            className="form-control"
                                            id="process-quantity"
                                            name="process-quantity"
                                            type="text"
                                            placeholder="Process Quantity"
                                            autoComplete="off"
                                            style={{ fontSize: '11px' }}
                                            value={processQuantity}
                                            onChange={onProcessQuantityChanged}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className=" col-sm-2"><b>Start / End Dates:</b></div>
                                    <div className=" col-md-5" >
                                        <Form.Group controlId="startDate">
                                            <Form.Control
                                                type="date"
                                                style={{ fontSize: '11px' }}
                                                value={startDate ? dateForPicker(startDate) : ''}
                                                placeholder={startDate ? dateForPicker(startDate) : "dd-mm-yyyy"}
                                                onChange={onStartDateChanged}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className=" col-md-5">
                                        <Form.Group controlId="endDate">
                                            <Form.Control
                                                type="date"
                                                style={{ fontSize: '11px' }}
                                                value={endDate ? dateForPicker(endDate) : ''}
                                                placeholder={endDate ? dateForPicker(endDate) : "dd-mm-yyyy"}
                                                onChange={onEndDateChanged}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className=" col-sm-2"><b>Activity Duration:</b></div>
                                    <div className=" col-sm-5">
                                        <input
                                            className="form-control"
                                            id="duration-unit"
                                            name="duration-unit"
                                            type="text"
                                            placeholder="Duration Unit"
                                            autoComplete="off"
                                            style={{ fontSize: '11px' }}
                                            value={durationUOM}
                                            onChange={onDurationUOMChanged}
                                        />
                                    </div>
                                    <div className=" col-sm-5">
                                        <input
                                            className="form-control"
                                            id="duration-quantity"
                                            name="duration-quantity"
                                            type="text"
                                            placeholder="Duration Quantity"
                                            autoComplete="off"
                                            style={{ fontSize: '11px' }}
                                            value={durationQuantity}
                                            onChange={onDurationQuantityChanged}
                                        />
                                    </div>
                                </div>
                            </div> {/* container-fluid */}
                        </div>
                    </div>
                </div>
                <br />
            </form>
        </div>

    )
}
export default NewActPop