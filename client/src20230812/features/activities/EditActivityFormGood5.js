import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useUpdateActivityMutation, useDeleteActivityMutation } from "./activitiesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import { FormControl, Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import { dateForPicker, dateFromDateString } from "../../hooks/useDatePicker"

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
let rowId = 0
class BtnCellRenderer extends Component {
    constructor(props, Id) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
        this.btnDelClickedHandler = this.btnDelClickedHandler.bind(this);
    }
    btnClickedHandler() {
        this.props.clicked(this.props.value);
    }
    btnDelClickedHandler(e) {
        //e.preventDefault()
        this.props.delClicked(this.props);
    }
    render() {
        return (
            this.props.Id === "resources" ?
                <div className="form-group dash-header__nav">
                    <button className="btn btn-primary btn-sm" onClick={this.btnClickedHandler}>Assign</button>
                    <button className="btn btn-danger btn-sm" onClick={this.btnDelClickedHandler}>Del</button>
                </div>

                :
                <div className="form-group dash-header__nav">
                    {/* <button className="btn btn-primary btn-sm" onClick={this.btnClickedHandler}>Close</button> */}
                    <button className="btn btn-danger btn-sm" onClick={this.btnDelClickedHandler}>Del</button>
                </div>
        )
    }
}

const assignValueGetter = (params) => {
    const lst = (params.data?.assignment) ?
        params.data.assignment.map(assign => {
            return (`${assign.resourcesId}:${assign.budget},\n `)
        })
        : ""

    return lst;
};
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
        "_id": resource._id,
        "rowId": resource._id
    }))

    const assignmentData = { "resourceId": "", "budget": 0 }
    const [rowData, setRowData] = useState(data)
    const [assignData, setAssignData] = useState([assignmentData])
    const [currResource, setCurrResource] = useState('')
    //let currResource
    let editedActivity = {}
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
            width: 50,
        };
    }, []);
    const resGridRef = useRef();
    const assignGridRef = useRef();
    const [columnDefs] = useState([
        {
            field: 'type',
            width: 50,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            filter: 'agSetColumnFilter',
            cellEditorPopup: false,
            cellEditorParams: {
                values: ['Labour', 'Equipment', 'Consumable'],
            },
        },

        { field: "details", editable: true },
        { field: "job", editable: true },
        { field: "costType", editable: true },
        { field: "uom", width: 50, editable: true },
        { field: "rate", width: 50, editable: true },
        { field: "qtyAssign", width: 50, editable: true },
        { field: "remarks", editable: true },
        {
            field: "assignment",
            width: 100,
            editable: false,
            headerName: 'Assign Employee / Equipment',
            valueGetter: assignValueGetter,

        },

        {
            field: 'type',
            headerName: 'Actions',
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (field) {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    setAssignData(this.data.assignment)
                    setCurrResource(this.data.id)
                    //currResource = this.data._id
                    document.getElementById("resourceDIV").style.display = "block";
                }, delClicked: function () {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "resources"
            },
        }

    ]);

    const [columnAssignDefs] = useState([
        { field: "resourcesId", width: 150, editable: true },
        { field: "budget", width: 150, editable: true },
        {

            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (field) {

                    const otherRowData = rowData.filter((row) =>
                        row._id !== currResource
                    )
                    const dirtyRowData = rowData.filter((row) =>
                        row._id === currResource
                    )
                    let rData = []
                    assignGridRef.current.api.forEachNode(node => rData.push(node.data));
                    dirtyRowData[0].assignment = rData
                    setRowData([...otherRowData, dirtyRowData[0]])
                    document.getElementById("resourceDIV").style.display = "none";
                },
                delClicked: function (eprops) {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    this.api.applyTransaction({ remove: [this.data] });
                    const otherRowData = rowData.filter((row) =>
                        row._id !== currResource
                    )
                    const dirtyRowData = rowData.filter((row) =>
                        row._id === currResource
                    )
                    let rData = []
                    assignGridRef.current.api.forEachNode(node => rData.push(node.data));
                    dirtyRowData[0].assignment = rData
                    setRowData([...otherRowData, dirtyRowData[0]])
                    //document.getElementById("resGrid").api.refreshCells();
                },
                Id: "assign"
            },
        }
    ])
    const [name, setName] = useState(activity.name)
    const [description, setDescription] = useState(activity.description)
    const [completed, setCompleted] = useState(activity.completed)
    const [userId, setUserId] = useState(activity.userId)
    const [processUOM, setProcessUOM] = useState(activity.process.uom)
    const [processQuantity, setProcessQuantity] = useState(activity.process.quantity)
    const [durationUOM, setDurationUOM] = useState(activity.duration.uom)
    const [durationQuantity, setDurationQuantity] = useState(activity.duration.quantity)
    const [startDate, setStartDate] = useState(activity.startDate)
    const [endDate, setEndDate] = useState(activity.endDate)


    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            // setName('')
            // setDescription('')
            // setCompleted(false)
            // setUserId('')
            // setProcessUOM('')
            // setProcessQuantity('')
            // setDurationUOM('')
            // setDurationQuantity('')
            // navigate('/dash/activities')
        }

    }, [isSuccess, isDelSuccess, navigate])

    useEffect(() => {
        //alert('startDate:' + startDate + '\n endDate:' + endDate)
    }, [startDate, endDate])

    const onNameChanged = (e) => setName(e.target.value)
    const onDescriptionChanged = (e) => setDescription(e.target.value)
    const onCompletedChanged = (e) => setCompleted(prev => !prev)
    const onUserIdChanged = (e) => setUserId(e.target.value)
    const onProcessUOMChanged = (e) => setProcessUOM(e.target.value)
    const onProcessQuantityChanged = (e) => setProcessQuantity(e.target.value)
    const onDurationUOMChanged = (e) => setDurationUOM(e.target.value)
    const onDurationQuantityChanged = (e) => setDurationQuantity(e.target.value)

    const onCellValueChanged = (e) => {
        console.log(JSON.stringify(rowData))
    }
    const onAssignValueChanged = (e) => {
        console.log(JSON.stringify(assignData))
    }


    const onStartDateChanged = (e) => setStartDate(e.target.value)
    const onEndDateChanged = (e) => setEndDate(e.target.value)

    const onNewResourcesClicked = (e) => {
        e.preventDefault()
        rowId = rowId + 1
        let newRowData = [...rowData, {

            "type": "",
            "details": "",
            "job": "",
            "costType": "",
            "uom": "",
            "rate": null,
            "qtyAssign": null,
            "remarks": "",
            "rowId": 'new' + rowId.toString()

        }]
        setRowData(newRowData)
        console.log(JSON.stringify(newRowData))
        //console.log(JSON.stringify(rowData))
    }

    const onNewAssignmentClicked = (e) => {
        e.preventDefault()


        let newAssignData =
            assignData ?
                [...assignData, {
                    "resourcesId": "",
                    "budget": 0
                }]
                : [assignmentData]

        setAssignData(newAssignData)
        console.log(JSON.stringify(newAssignData))
        //console.log(JSON.stringify(rowData))
    }

    const onUpdateAssignmentClicked = (e) => {
        const otherRowData = rowData.filter((row) =>
            row._id !== currResource
        )
        const dirtyRowData = rowData.filter((row) =>
            row._id === currResource
        )
        let rData = []
        assignGridRef.current.api.forEachNode(node => rData.push(node.data));
        dirtyRowData[0].assignment = rData
        setRowData([...otherRowData, dirtyRowData[0]])
        document.getElementById("resourceDIV").style.display = "none";
    }
    const canSave = [activity.id].every(Boolean) && !isLoading

    const onSaveActivityClicked = async (e) => {
        e.preventDefault()
        let process = {}
        let duration = {}
        if (canSave) {
            editedActivity._id = activity.id
            editedActivity.name = name
            editedActivity.description = description
            editedActivity.startDate = startDate//dateFromDateString(startDate)
            editedActivity.endDate = endDate//dateFromDateString(endDate)
            editedActivity.completed = completed
            editedActivity.userId = userId
            process.uom = processUOM
            process.quantity = processQuantity
            editedActivity.process = process
            duration.uom = durationUOM
            duration.quantity = durationQuantity
            editedActivity.duration = duration
            editedActivity.resources = rowData
            console.log(editedActivity)
            console.log(JSON.stringify(editedActivity))
            await updateActivity(editedActivity)
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

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <form onSubmit={e => e.preventDefault()}>
                <div className="panel">
                    <h2>Edit Activity #{activity.name}</h2>
                    <div className="form-group dash-header__nav">
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
                    <div className="col-sm-2"><b>Name:</b></div>
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
                    <div className="col-sm-2"><b>Description:</b></div>
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
                    <div className="col-sm-2"><b>Activity Process:</b></div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="process-unit"
                            name="process-unit"
                            type="text"
                            placeholder="Process Unit"
                            autoComplete="off"
                            value={processUOM}
                            onChange={onProcessUOMChanged}
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
                    <div className="col-sm-2"><b>Start / End Dates:</b></div>
                    <div className="col-md-3" >
                        <Form.Group controlId="startDate">
                            <Form.Control
                                type="date"
                                value={startDate ? dateForPicker(startDate) : ''}
                                placeholder={startDate ? dateForPicker(startDate) : "dd-mm-yyyy"}
                                onChange={onStartDateChanged}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <Form.Group controlId="endDate">
                            <Form.Control
                                type="date"
                                value={endDate ? dateForPicker(endDate) : ''}
                                placeholder={endDate ? dateForPicker(endDate) : "dd-mm-yyyy"}
                                onChange={onEndDateChanged}
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"><b>Activity Duration:</b></div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="duration-unit"
                            name="duration-unit"
                            type="text"
                            placeholder="Duration Unit"
                            autoComplete="off"
                            value={durationUOM}
                            onChange={onDurationUOMChanged}
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
                <br />
                <div className="panel-heading"><b>Resources Plans and assignment</b></div>
                <div className="container-sm">
                    <br />
                    <div className="panel-group">
                        <div className="panel panel-default">
                            <div className="panel-heading">Resources List</div>
                            <div className="form-group  dash-header__nav">
                                <button
                                    className="btn btn-primary"
                                    title="New Resources"
                                    onClick={onNewResourcesClicked}
                                >
                                    Add Resouces
                                </button>
                            </div>
                            <div className="panel-body">
                                <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
                                    <AgGridReact
                                        ref={resGridRef}
                                        onCellValueChanged={onCellValueChanged}
                                        onGridReady={(event) => event.api.sizeColumnsToFit()}
                                        defaultColDef={defaultColDef}
                                        rowData={rowData}
                                        columnDefs={columnDefs}>
                                    </AgGridReact>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="panel panel-default" id="resourceDIV" style={{ display: "none" }}>
                            <div className="panel-heading">Resource Assignments</div>
                            <div className="form-group  dash-header__nav">
                                <button
                                    className="btn btn-primary"
                                    title="New Resources"
                                    onClick={onNewAssignmentClicked}
                                >
                                    New
                                </button>
                                <button
                                    className="btn btn-primary"
                                    title="Update Resources"
                                    onClick={onUpdateAssignmentClicked}
                                >
                                    Update
                                </button>
                            </div>
                            <div className="panel-body">
                                <div className="ag-theme-alpine" style={{ height: 200, width: "100%" }}>
                                    <AgGridReact
                                        ref={assignGridRef}
                                        onCellValueChanged={onAssignValueChanged}
                                        onGridReady={(event) => event.api.sizeColumnsToFit()}
                                        defaultColDef={defaultColDef}
                                        rowData={assignData}
                                        columnDefs={columnAssignDefs}>
                                    </AgGridReact>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="form-group row">
                    <div className="col-sm-2">Resources:</div>
                    <div className="table-responsive-sm">
                        <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
                            <AgGridReact
                                onCellValueChanged={onCellValueChanged}
                                onGridReady={(event) => event.api.sizeColumnsToFit()}
                                defaultColDef={defaultColDef}
                                rowData={rowData}
                                columnDefs={columnDefs}>
                            </AgGridReact>
                        </div>
                    </div>
                </div> */}
                {/* <br />
                <div className="form-group row" id="resourceDIV" style={{ display: "none" }}>
                    <div className="col-sm-2">Resource Assignments:</div>
                    <div className="table-responsive-sm">
                        <div className="ag-theme-alpine" style={{ height: 200, width: "100%" }}>
                            <AgGridReact
                                onCellValueChanged={onAssignValueChanged}
                                onGridReady={(event) => event.api.sizeColumnsToFit()}
                                defaultColDef={defaultColDef}
                                rowData={assignData}
                                columnDefs={columnAssignDefs}>
                            </AgGridReact>
                        </div>
                    </div>
                </div> */}
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
                                id="activity-userid"
                                name="usernameuserid"
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
                    </div>
                </div>

            </form>
        </>
    )
    return content
}

export default EditActivityForm