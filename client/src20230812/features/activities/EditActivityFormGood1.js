import { useState, useEffect, useMemo } from "react"
import { useUpdateActivityMutation, useDeleteActivityMutation } from "./activitiesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import Resource from './Resource'
import { FormControl } from "react-bootstrap"
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const EditActivityForm = ({ activity, users }) => {

    const { isManager, isAdmin } = useAuth()

    const [updateActivity, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateActivityMutation()

    const [deleteActivity, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteActivityMutation()

    const navigate = useNavigate()
    //const [rowData, setRowData] = useState([])
    // activity.resources.map(resource => (
    //     console.log(resource)
    // ))
    // const [rowData1] = useState(
    //     { _id: "Toyota", type: "Celica", details: 35000, id: `1` },
    //     { _id: "Ford", type: "Mondeo", details: 32000, id: `2` },
    //     { _id: "Porsche", type: "Boxter", details: 72000, id: `3` }
    // )
    //rowData = activity.resources
    const data = Array.from(activity.resources).map((resource, index) => ({
        "type": resource.type,
        "details": resource.details,
        "job": resource.job,
        "costType": resource.costType,
        "uom": resource.uom,
        "rate": resource.rate,
        "qtyAssign": resource.qtyAssign,
        "remarks": resource.remarks,
        "assignment": resource.assignment,
        "_id": resource._id
    }))

    const [rowData] = useState(data)
    // const resources_data = [
    //     {
    //         "type": "Labour",
    //         "details": "",
    //         "job": "Welder",
    //         "costType": "hourly",
    //         "uom": "rm",
    //         "rate": 15,
    //         "qtyAssign": 100,
    //         "remarks": "",
    //         "assignment": [
    //             {
    //                 "resourcesId": "emp001",
    //                 "budget": 10
    //             }
    //         ]
    //     },
    //     {
    //         "type": "Equipment",
    //         "details": "excavator",
    //         "job": "Earth Clearing",
    //         "costType": "hourly",
    //         "uom": "rm",
    //         "rate": 100,
    //         "qtyAssign": 1000,
    //         "remarks": "",
    //         "assignment": [
    //             {
    //                 "resourcesId": "ex-010",
    //                 "budget": 10
    //             },
    //             {
    //                 "resourcesId": "ex-011",
    //                 "budget": 10
    //             }
    //         ]
    //     },
    //     {
    //         "type": "Equipment",
    //         "details": "vehicle",
    //         "job": "Earth Clearing",
    //         "costType": "hourly",
    //         "uom": "rm",
    //         "rate": 100,
    //         "qtyAssign": 1000,
    //         "remarks": "",
    //         "assignment": [
    //             {
    //                 "resourcesId": "ex-hilux01",
    //                 "budget": 10
    //             }
    //         ]
    //     }
    // ]

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
        };
    }, []);

    console.log(rowData)
    const [columnDefs] = useState([
        { field: "_id", editable: true },
        { field: "type", editable: true },
        { field: "details", editable: true },
        { field: "job", editable: true },
        { field: "costType", editable: true },
        { field: "uom", editable: true },
        { field: "rate", editable: true },
        { field: "qtyAssign", editable: true },
        { field: "remarks", editable: true }
    ]);
    // const [rowData] = useState([
    //     { make: "Toyota", model: "Celica", price: 35000, id: `1` },
    //     { make: "Ford", model: "Mondeo", price: 32000, id: `2` },
    //     { make: "Porsche", model: "Boxter", price: 72000, id: `3` }
    // ]);

    // const [columnDefs] = useState([
    //     { field: "make", editable: true },
    //     { field: "model" },
    //     { field: "price" }
    // ]);

    const [name, setName] = useState(activity.name)
    const [description, setDescription] = useState(activity.description)
    // const [title, setTitle] = useState(activity.title)
    // const [text, setText] = useState(activity.text)
    const [completed, setCompleted] = useState(activity.completed)
    const [userId, setUserId] = useState(activity.user)
    const [processUnit, setProcessUnit] = useState(activity.process.uom)
    const [processQuantity, setProcessQuantity] = useState(activity.process.quantity)
    const [durationUnit, setDurationUnit] = useState(activity.duration.uom)
    const [durationQuantity, setDurationQuantity] = useState(activity.duration.quantity)


    const [typeChanged, setTypeChanged] = useState(activity.resources.type)
    const [detailsChanged, setDetailsChanged] = useState(activity.resources.details)
    const [jobChanged, setJobChanged] = useState(activity.resources.job)
    const [costTypeChanged, setCostTypeChanged] = useState(activity.resources.costType)
    const [uomChanged, setUomChanged] = useState(activity.resources.uom)
    const [rateChanged, setRateChanged] = useState(activity.resources.rate)
    const [qtyAssignChanged, setQtyAssignChanged] = useState(activity.resources.qtyAssign)
    const [remarksChanged, setRemarksChanged] = useState(activity.resources.remarks)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setName('')
            setDescription('')
            //setTitle('')
            //setText('')
            setCompleted(false)
            setUserId('')
            setProcessUnit('')
            setProcessQuantity('')
            setDurationUnit('')
            setDurationQuantity('')
            setTypeChanged('')
            setDetailsChanged('')
            setJobChanged('')
            setCostTypeChanged('')
            setUomChanged('')
            setRateChanged('')
            setQtyAssignChanged('')
            setRemarksChanged('')
            navigate('/dash/activities')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)

    // const onTitleChanged = e => setTitle(e.target.value)
    // const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onProcessUnitChanged = e => setProcessUnit(e.target.value)
    const onProcessQuantityChanged = e => setProcessQuantity(e.target.value)
    const onDurationUnitChanged = e => setDurationUnit(e.target.value)
    const onDurationQuantityChanged = e => setDurationQuantity(e.target.value)

    const onTypeChanged = e => setTypeChanged(e.target.value)
    const onDetailsChanged = e => setDetailsChanged(e.target.value)
    const onJobChanged = e => setJobChanged(e.target.value)
    const onCostTypeChanged = e => setCostTypeChanged(e.target.value)
    const onUomChanged = e => setUomChanged(e.target.value)
    const onRateChanged = e => setRateChanged(e.target.value)
    const onQtyAssignChanged = e => setQtyAssignChanged(e.target.value)
    const onRemarksChanged = e => setRemarksChanged(e.target.value)


    const canSave = [userId].every(Boolean) && !isLoading

    const onSaveActivityClicked = async (e) => {
        if (canSave) {
            await updateActivity({ id: activity.id, user: userId, completed })
        }
    }

    const onDeleteActivityClicked = async () => {
        await deleteActivity({ id: activity.id })
    }

    const created = new Date(activity.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(activity.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    // const validTitleClass = !title ? "form__input--incomplete" : ''
    // const validTextClass = !text ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="btn btn-danger"
                title="Delete"
                onClick={onDeleteActivityClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>

        )
    }


    const onClickDiv = (e) => {
        const innertxt = e.target.innerText

        let eTarget = e
        console.log(innertxt)
        e.target.innerHTML = `<input type='text' id='txtt' onChange={this.parentNode.innerText=this.value} value='${innertxt}' /input>`

    }

    const handleOnChanged = (e) => {
        e.preventDefault();
        alert("handleOnChanged");
    }
    // const resources = activity.resources
    // const tableContent = resources?.length && resources.map(resource => <Resource key={resource._id} resource={resource} activity_Id={activity._Id} handleOnChanged={handleOnChanged} />)
    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <form onSubmit={e => e.preventDefault()}>


                <div className="panel">
                    <h2>Edit Activity #{activity.ticket}</h2>
                    <div className="form-group form__action-buttons">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveActivityClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Name:</div>
                    <div className="col-sm-6">
                        <input
                            className="form-control"
                            id="activity-name"
                            name="Name"
                            type="text"
                            placeholder="Name"
                            autoComplete="off"
                            value={name}
                            onChange={onNameChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Description:</div>
                    <div className="col-sm-6">
                        <textarea
                            className="form-control"
                            id="activity-description"
                            name="description"
                            rows="4"
                            value={description}
                            onChange={onDescriptionChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Activity Process:</div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="process-unit"
                            name="process-unit"
                            type="text"
                            placeholder="Process Unit"
                            autoComplete="off"
                            value={processUnit}
                            onChange={onProcessUnitChanged}
                        />
                    </div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="process-quantity"
                            name="process-quantity"
                            type="text"
                            placeholder="Process Quantity"
                            autoComplete="off"
                            value={processQuantity}
                            onChange={onProcessQuantityChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Activity Duration:</div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="duration-unit"
                            name="duration-unit"
                            type="text"
                            placeholder="Duration Unit"
                            autoComplete="off"
                            value={durationUnit}
                            onChange={onDurationUnitChanged}
                        />
                    </div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="duration-quantity"
                            name="duration-quantity"
                            type="text"
                            placeholder="Duration Quantity"
                            autoComplete="off"
                            value={durationQuantity}
                            onChange={onDurationQuantityChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2" id="divt"
                        onClick={(e) => onClickDiv(e)}
                    >Resources:</div>
                    <div className="table-responsive-sm">
                        <div className="ag-theme-alpine" style={{ height: 200, width: "100%" }}>
                            <AgGridReact onCellValueChanged={(e) => alert(JSON.stringify(rowData))} defaultColDef={defaultColDef} rowData={rowData} columnDefs={columnDefs}></AgGridReact>
                        </div>
                    </div>
                </div>

                <div className="panel panel-info">

                    <div className="form-group row">
                        <div className="col-sm-2"> WORK COMPLETE:</div>
                        <div className="col-sm-10">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    id="activity-completed"
                                    name="completed"
                                    type="checkbox"
                                    checked={completed}
                                    onChange={onCompletedChanged}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2"> ASSIGNED TO:</div>
                        <div className="col-sm-2">
                            <select
                                id="activity-username"
                                name="username"
                                className="form-control"
                                value={userId}
                                onChange={onUserIdChanged}
                            >
                                {options}
                            </select>
                        </div>
                    </div>
                    <div className="">
                        <p className=""><span>Created: {created}</span><span style={{ padding: "15px" }} /><span>Updated: {updated}</span></p>
                        {/* <p className=""></p> */}
                    </div>
                </div>

            </form>
        </>
    )
    return content
}

export default EditActivityForm