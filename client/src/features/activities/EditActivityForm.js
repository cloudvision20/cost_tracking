import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useUpdateActivityMutation, useDeleteActivityMutation } from "./activitiesApiSlice"
import { useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import { Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import { dateForPicker } from "../../hooks/useDatePicker"
// import EditDailyReportForm from '../dailyReports/EditDailyReportForm'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
//import { config } from "@fortawesome/fontawesome-svg-core"

let rowId = 0
let editedActivity = {}
//const errContent = useRef('');
// Button definition for buttons in Ag-grid
const btnStyle = { padding: "2px", height: "70%", fontSize: "11px" }
const divButton = { display: "flex", flexFlow: "row nowrap", justifyContent: "flex-start", padding: "1px", gap: "0.5em" }

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
                <div className="form-group ct-header__nav" style={divButton}>
                    <button className="btn btn-primary btn-sm" style={btnStyle} onClick={this.btnClickedHandler}>Assign</button>
                    <button className="btn btn-danger btn-sm" style={btnStyle} onClick={this.btnDelClickedHandler}>Del</button>
                </div>
                : this.props.Id === "assign" ?
                    <div className="form-group ct-header__nav " style={divButton}>
                        <button className="btn btn-danger btn-sm" style={btnStyle} onClick={this.btnDelClickedHandler}>Del</button>
                    </div>
                    :
                    <div className="form-group " style={divButton}>
                        <button className="btn btn-primary btn-xs" style={btnStyle} onClick={this.btnClickedHandler}>new</button>
                        <button className="btn btn-danger btn-xs" style={btnStyle} onClick={this.btnDelClickedHandler}>edit</button>
                    </div >
        )
    }
}

const extractKeys = (mappings) => {
    return Object.keys(mappings);
};

const lookupValue = (mappings, key) => {
    return mappings[key];
};

const lookupKey = (mappings, name) => {
    const keys = Object.keys(mappings);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (mappings[key] === name) {
            return key;
        }
    }
};

const EditActivityForm = ({ res }) => {
    const location = useLocation();
    const projects = res.projects
    const activity = res.activity[0]
    const users = res.users
    const equipment = res.equipment
    const consumables = res.consumables
    const dailyReports = res.dailyReports
    let errRef = useRef()


    const { isManager, isAdmin } = useAuth()
    const usersMapping = Object.fromEntries(users.map(user => ([user.employeeId, user.username])));
    const usersCodes = extractKeys(usersMapping);
    const equipmentMapping = Object.fromEntries(equipment.map(equipmnt => ([equipmnt._id, equipmnt.name])));
    const equipmentCodes = extractKeys(equipmentMapping);
    const consumablesMapping = Object.fromEntries(consumables.map(consumable => ([consumable._id, consumable.name])));
    const consumablesCodes = extractKeys(consumablesMapping);
    const mapping = { 'Labour': usersMapping, 'Equipment': equipmentMapping, 'Consumables': consumablesMapping }
    const codes = { 'Labour': usersCodes, 'Equipment': equipmentCodes, 'Consumables': consumablesCodes }

    const assignValueGetter = (params) => {
        const lst = (params.data?.assignment) ?
            params.data.assignment.map(assign => {
                console.log('mapping labour :' + JSON.stringify(mapping[params.data.type] + '  type:' + params.data.type))
                return (`${lookupValue(mapping[params.data.type], assign.resourcesId)}:${assign.budget},\n `)
            })
            : ""
        return lst;
    };

    let curResType = 'Labour'
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

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
            width: 50,
        };
    }, []);

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

    const resGridRef = useRef();
    const [rowData, setRowData] = useState(data)
    const [currResId, setCurrResId] = useState('')
    const [columnDefs] = useState([
        {
            field: 'type',
            width: 100,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            filter: 'agSetColumnFilter',
            cellEditorPopup: false,
            cellEditorParams: {
                values: ['Labour', 'Equipment', 'Consumables'],
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
            //field: 'type',
            headerName: 'Actions',
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (field) {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    setRdAssignData(this.data.assignment)
                    setCurrResId(this.data.rowId)
                    curResType = this.data.type
                    //console.log('curResType: ' + curResType)

                    columnAssignDefs[0] = AssignDefCol00(curResType)
                    setColumnAssignDefs(columnAssignDefs)
                    assignGridRef.current.api.setColumnDefs(columnAssignDefs)

                    document.getElementById("resourceDIV").style.display = "block";
                }, delClicked: function () {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "resources"
            },
        }
    ]);

    const assignGridRef = useRef();
    const assignData = { "resourceId": "", "budget": 0 }
    const [rdAssignData, setRdAssignData] = useState([assignData])
    const AssignDefCol00 = (type) => {
        return ({
            field: 'resourcesId',
            width: 150,
            editable: true,
            enableCellTextSelection: true,
            ensureDomOrder: true,
            cellEditor: 'agSelectCellEditor',
            filter: 'agSetColumnFilter',
            cellEditorPopup: false,
            cellEditorParams: {
                values: codes[type],
            },
            valueFormatter: (params) => {
                return lookupValue(mapping[type], params.value);
            },
            valueSetter: params => {
                console.log('index =' + params.node.rowindex)
                console.log('valueParser')
                params.node.data = { "resourcesId": params.newValue, "budget": params.node.data.budget }
                console.log('data =' + JSON.stringify(params.node.data))
                let rData = []
                assignGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdAssignData(rData)
            },
            valueParser: params => {
                return lookupKey(mapping[type], params.newValue);
            }

        })
    }
    const [columnAssignDefs, setColumnAssignDefs] = useState([
        {
            field: 'resourcesId',
            width: 150,
            editable: true,
        },
        { field: "budget", width: 150, editable: true },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    this.api.applyTransaction({ remove: [this.data] });
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
                    //document.getElementById("resGrid").api.refreshCells();
                },
                Id: "assign"
            },
        }
    ])


    const dailyReportGridRef = useRef();
    const dailyReportData = dailyReports.map(dailyReport => {
        return ({
            "status":
                dailyReport.completed
                    ? "Completed"
                    : "Open",
            "date": dateForPicker(dailyReport.reportDate),
            "employee": dailyReport.userId.username,
            "id": dailyReport._id
        })
    })


    //const dailyReportData = { "status": "", "date": "", "employee": "" }
    const [rdDailyReport] = useState(dailyReportData)
    const [columnDRDefs] = useState([
        { field: "status", width: 150, editable: false },
        { field: "date", width: 150, editable: false },
        { field: "employee", width: 150, editable: false }
    ])
    const [name, setName] = useState(activity.name)
    const [description, setDescription] = useState(activity.description)
    const [completed, setCompleted] = useState(activity.completed)
    const [userId, setUserId] = useState(activity.userId)
    const [projectId, setProjectId] = useState(activity.projectId)
    const [processUOM, setProcessUOM] = useState(activity.process.uom ? activity.process.uom : '')
    const [processQuantity, setProcessQuantity] = useState(activity.process.quantity)
    const [durationUOM, setDurationUOM] = useState(activity.duration.uom)
    const [durationQuantity, setDurationQuantity] = useState(activity.duration.quantity)
    const [startDate, setStartDate] = useState(activity.startDate)
    const [endDate, setEndDate] = useState(activity.endDate)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            errRef.className = "resmsg"
            // isSuccess ? errContent.current = " Saved!"
            //     : errContent.current = "Deleted!"
            if (isSuccess) {
                window.alert("Activity Saved!")
                errContent.current = " Saved!"
                if (location?.state?.url) {
                    navigate(location.state.url, { state: { load: true } })
                }
            }
            if (isDelSuccess) {
                window.alert("Activity Deleted!")
                errContent.current = " Deleted!"
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
                navigate(-1) //navigate('/dash/activities')
            }
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = (e) => setName(e.target.value)
    const onDescriptionChanged = (e) => setDescription(e.target.value)
    const onCompletedChanged = (e) => setCompleted(prev => !prev)
    const onUserIdChanged = (e) => setUserId(e.target.value)
    const onProjectIdChanged = (e) => setProjectId(e.target.value)
    const onProcessUOMChanged = (e) => setProcessUOM(e.target.value)
    const onProcessQuantityChanged = (e) => setProcessQuantity(e.target.value)
    const onDurationUOMChanged = (e) => setDurationUOM(e.target.value)
    const onDurationQuantityChanged = (e) => setDurationQuantity(e.target.value)

    const onCellValueChanged = (e) => {
        console.log('onCellValueChanged-rowData:' + JSON.stringify(rowData))
    }
    const onAssignValueChanged = (e) => {

        console.log('onAssignValueChanged-rdAssignData:' + JSON.stringify(rdAssignData))
    }
    const onDRValueChanged = (e) => {
        console.log('onDRValueChanged-rdDailyReport:' + JSON.stringify(rdDailyReport))
    }
    const onDRRowDblClicked = (e) => {
        console.log('onDRRowClicked-rdDailyReport:' + JSON.stringify(rdDailyReport))
        navigate(`/dash/dailyReports/${e.data.id}`)
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
    }

    const onNewAssignmentClicked = (e) => {
        e.preventDefault()
        let newRdAssignData =
            rdAssignData ?
                [...rdAssignData, {
                    "resourcesId": "",
                    "budget": 0
                }]
                : [assignData]
        setRdAssignData(newRdAssignData)
    }

    const onNewDailyReportClicked = (e) => {
        navigate(`/dash/dailyReports/new/${activity._id}`)
    }
    const onUpdateAssignmentClicked = (e) => {
        let rData = []
        const newRowData = rowData
        assignGridRef.current.api.forEachNode(node => rData.push(node.data));
        newRowData[rowData.findIndex((data) => data.rowId === currResId)].assignment = rData
        setRowData(newRowData)
        resGridRef.current.api.refreshCells()
        document.getElementById("resourceDIV").style.display = "none";
    }
    const canSave = [activity._id].every(Boolean) && !isLoading

    const onSaveActivityClicked = async (e) => {
        //e.preventDefault()
        let process = {}
        let duration = {}
        if (canSave) {
            editedActivity._id = activity._id
            editedActivity.name = name
            editedActivity.description = description
            editedActivity.startDate = startDate//dateFromDateString(startDate)
            editedActivity.endDate = endDate//dateFromDateString(endDate)
            editedActivity.completed = completed
            editedActivity.userId = userId
            editedActivity.projectId = projectId
            process.uom = processUOM
            process.quantity = processQuantity
            editedActivity.process = process
            duration.uom = durationUOM
            duration.quantity = durationQuantity
            editedActivity.duration = duration
            editedActivity.resources = rowData
            // console.log(editedActivity)
            // console.log(JSON.stringify(editedActivity))
            await updateActivity(editedActivity)
        }
    }

    const onDeleteActivityClicked = async () => {
        if (window.confirm("Confirm Delete Activity?")) {
            await deleteActivity({ id: activity._id })
        }
    }

    const created = new Date(activity.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(activity.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user._id}
                value={user._id}
            > {user.username}</option >
        )
    })

    const prjOptions = projects.map(project => {
        return (
            <option
                key={project._id}
                value={project._id}
            > {project.title}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '')

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
            <p ref={errRef} className={errClass}>{errContent.current}</p>
            <form onSubmit={e => e.preventDefault()}>
                <div className="panel">
                    <h6><b>Edit Activity #{activity.name}</b></h6>
                    <div className="form-group ct-header__nav">
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
                <div className="container grid_system_no_border" style={{ fontSize: '12px', borderLeft: "0px solid blue", borderBottom: "0px solid blue" }}>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="container-fluid" style={{ border: "0px" }}>
                                <div className="form-group row">
                                    <div className="col-sm-2"><b>Name:</b></div>
                                    <div className="col-sm-4">
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

                                    <div className="col-sm-2"><b>Projects:</b></div>
                                    <div className="col-sm-4">
                                        <select
                                            id="userid"
                                            name="userid"
                                            className="form-control"
                                            value={projectId._id}
                                            onChange={onProjectIdChanged}
                                        >
                                            {prjOptions}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-2"><b>Description:</b></div>
                                    <div className="col-sm-10">
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
                                    <div className="col-sm-5">
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
                                    <div className="col-sm-5">
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
                                    <div className="col-md-5" >
                                        <Form.Group controlId="startDate">
                                            <Form.Control
                                                type="date"
                                                value={startDate ? dateForPicker(startDate) : ''}
                                                placeholder={startDate ? dateForPicker(startDate) : "dd-mm-yyyy"}
                                                onChange={onStartDateChanged}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-5">
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
                                    <div className="col-sm-5">
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
                                    <div className="col-sm-5">
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
                            </div> {/* container-fluid */}
                        </div>
                        <div className="col-sm-6">
                            <div className="container-fluid" style={{ border: "0px" }}>
                                <div className="form-group row" style={{ display: "flex", flexFlow: "row nowrap", justifyContent: "flex-start", padding: "1px", gap: "0.5em" }}>
                                    <div className="col-sm-3"><b> Daily Dairy List:</b></div>
                                    <div className="com-sm-2">
                                        <button className="btn btn-primary btn-xs" style={{ padding: "2px", height: "80%", fontSize: "11px" }} onClick={onNewDailyReportClicked}>Add</button>
                                    </div >
                                </div>
                                <div className="ag-theme-balham" style={{ height: 250, width: "100%" }}>
                                    <AgGridReact
                                        // class="ag-theme-alpine"
                                        ref={dailyReportGridRef}
                                        onCellValueChanged={onDRValueChanged}
                                        onRowDoubleClicked={onDRRowDblClicked}
                                        onGridReady={(event) => event.api.sizeColumnsToFit()}
                                        defaultColDef={defaultColDef}
                                        rowData={rdDailyReport}
                                        columnDefs={columnDRDefs}>
                                    </AgGridReact>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="panel-heading"><b>Resources Plans and assignment</b></div>
                <div className="container-sm">
                    <br />
                    <div className="panel-group">
                        <div className="panel panel-default">
                            <div className="panel-heading">Resources List</div>
                            <div className="form-group  ct-header__nav">
                                <button
                                    className="btn btn-primary"
                                    title="New Resources"
                                    onClick={onNewResourcesClicked}
                                >
                                    Add Resouces
                                </button>
                            </div>
                            <div className="panel-body">
                                <div className="ag-theme-balham" style={{ height: 300, width: "100%" }}>
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
                            <div className="form-group  ct-header__nav">
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
                                    Confirm
                                </button>
                            </div>
                            <div className="panel-body">
                                <div className="ag-theme-balham" style={{ height: 200, width: "100%" }}>
                                    <AgGridReact
                                        ref={assignGridRef}
                                        onCellValueChanged={onAssignValueChanged}
                                        onGridReady={(event) => event.api.sizeColumnsToFit()}
                                        defaultColDef={defaultColDef}
                                        readOnlyEdit={false}
                                        rowData={rdAssignData}
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
                        <div className="col-sm-2"><b>ASSIGNED TO:</b></div>
                        <div className="col-sm-2">
                            <select
                                id="userid"
                                name="userid"
                                className="form-control"
                                value={userId._id}
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