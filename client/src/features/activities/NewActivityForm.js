import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewActivityMutation } from "./activitiesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FormControl, Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import { dateForPicker, dateFromDateString } from "../../hooks/useDatePicker"

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

let rowId = 0
let eActivity = {}

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

const NewActivityForm = ({ users }) => {

    const [addNewActivity, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewActivityMutation()

    const navigate = useNavigate()

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
        };
    }, []);
    const data = {
        "type": "",
        "details": "",
        "job": "",
        "costType": "",
        "uom": "",
        "rate": "",
        "qtyAssign": "",
        "remarks": "",
        "rowId": 0
    }
    const resGridRef = useRef();
    const [rowData, setRowData] = useState([data])
    const [currResId, setCurrResId] = useState('')
    const [columnDefs] = useState([
        {
            field: 'rowId',
            headerName: 'idx',
            width: 100,

        },
        {
            field: 'type',
            width: 100,
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
            headerName: 'Assignment',
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (field) {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    setAssignData(this.data.assignment)
                    setCurrResId(this.data.id)
                    document.getElementById("resourceDIV").style.display = "block";
                },
                delClicked: function () {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "resources"
            },
        }
    ]
    );

    const assignGridRef = useRef();
    const assignmentData = { "resourceId": "", "budget": 0 }
    const [assignData, setAssignData] = useState([assignmentData])
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
                        row.rowId !== currResId
                    )
                    const dirtyRowData = rowData.filter((row) =>
                        row.rowId === currResId
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
                        row._id !== currResId
                    )
                    const dirtyRowData = rowData.filter((row) =>
                        row._id === currResId
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
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [completed, setCompleted] = useState(false)
    const [userId, setUserId] = useState(users[0].id)
    const [processUOM, setProcessUOM] = useState('')
    const [processQuantity, setProcessQuantity] = useState('')
    const [durationUOM, setDurationUOM] = useState('')
    const [durationQuantity, setDurationQuantity] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setDescription('')
            setCompleted(false)
            setUserId('')
            setProcessUOM('')
            setProcessQuantity('')
            setDurationUOM('')
            setDurationQuantity('')
            setStartDate('')
            setEndDate('')
            navigate('/dash/activities')
        }
    }, [isSuccess, navigate])

    // useEffect(() => {
    //     console.log('rowData useEffect = ' + JSON.stringify(rowData))
    // }, [rowData])

    const onNameChanged = e => setName(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onCompletedChanged = e => setCompleted(e.target.value ? true : false)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onProcessUOMChanged = e => setProcessUOM(e.target.value)
    const onProcessQuantityChanged = e => setProcessQuantity(e.target.value)
    const onDurationUOMChanged = e => setDurationUOM(e.target.value)
    const onDurationQuantityChanged = e => setDurationQuantity(e.target.value)

    const onCellValueChanged = (e) => {
        console.log('onCellValueChanged-rowData:' + JSON.stringify(rowData))
    }
    const onAssignValueChanged = (e) => {
        console.log('onAssignValueChanged-assignData:' + JSON.stringify(assignData))
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
            "rate": "",
            "qtyAssign": "",
            "remarks": "",
            "rowId": 'new' + rowId.toString()
        }]
        setRowData(newRowData)
        console.log(JSON.stringify(newRowData))
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
            row.rowId !== currResId
        )
        const dirtyRowData = rowData.filter((row) =>
            row.rowId === currResId
        )
        let rData = []
        assignGridRef.current.api.forEachNode(node => rData.push(node.data));
        dirtyRowData[0].assignment = rData
        setRowData([...otherRowData, dirtyRowData[0]])
        document.getElementById("resourceDIV").style.display = "none";
    }
    const canSave = [userId].every(Boolean) && !isLoading

    const onSaveActivityClicked = async (e) => {
        let process = {}
        let duration = {}
        e.preventDefault()
        if (canSave) {
            eActivity.name = name
            eActivity.description = description
            eActivity.startDate = startDate
            eActivity.endDate = endDate
            eActivity.completed = completed
            eActivity.userId = userId
            process.uom = processUOM
            process.quantity = processQuantity
            eActivity.process = process
            duration.uom = durationUOM
            duration.quantity = durationQuantity
            eActivity.duration = duration
            eActivity.resources = rowData
            console.log(eActivity)
            console.log(JSON.stringify(eActivity))
            await addNewActivity(eActivity)
        }
    }

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form onSubmit={onSaveActivityClicked}>
                <div className="panel">
                    <h2>New Activity</h2>
                    <div className="form-group dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveActivityClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
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
                            placeholder="Description"
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
                    <div className="col-md-3">
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

                <div className="panel panel-info">

                    <div className="form-group row">
                        <div className="col-sm-2"> <b>WORK COMPLETE:</b></div>
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
                        <div className="col-sm-2"> <b>ASSIGNED TO:</b></div>
                        <div className="col-sm-2">
                            <select
                                id="username"
                                name="username"
                                className="form-control"
                                value={userId}
                                onChange={onUserIdChanged}
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

export default NewActivityForm