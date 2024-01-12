import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useUpdateProjectMutation, useDeleteProjectMutation } from "./projectsApiSlice"
import { useAddNewActivityMutation } from "../activities/activitiesApiSlice"
import NewActProp from "./NewActPop"
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
let pngRowId = 0
class BtnCellRenderer extends Component {
    constructor(props, Id) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
        this.btnDelClickedHandler = this.btnDelClickedHandler.bind(this);
    }
    btnClickedHandler() { this.props.clicked(this.props.value); }
    btnDelClickedHandler(e) { this.props.delClicked(this.props); }
    render() {
        return (
            <div className="form-group ct-header__nav">
                <button className="btn btn-danger btn-xs" style={{ fontSize: "8px" }} onClick={this.btnDelClickedHandler}>Del</button>
            </div>
        )
    }
}

const EditProjectForm = ({ startActivities, project, users }) => {

    let activities = startActivities
    const { isManager, isAdmin } = useAuth()
    let png = []
    const blankPng = {
        "description": null,
        "uom": null,
        "quantity": 0,
        "rate": 0,
        "amount": 0
    }

    if (project?.png) {
        png = project.png
    } else {
        png = [blankPng]
    }
    const [updateProject, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateProjectMutation()

    const [deleteProject, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteProjectMutation()

    const navigate = useNavigate()

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
            width: 50,
        };
    }, []);


    const [addNewActivity, {
        isLoading: isNewActLoading,
        isSuccess: isNewActSuccess,
        isError: isNewActError,
        error: newActError
    }] = useAddNewActivityMutation()

    const data = Array.from(activities).map((activity, index) => ({
        "Status": activity.completed ? "Completed" : "Open",
        "name": activity.name,
        "description": activity.description,
        "username": activity.userId.username,
        "_id": activity._id,
        "rowId": activity._id
    }))

    const activitiesRef = useRef();
    const [rdAct, setRdAct] = useState(data)
    const [columnDefs] = useState([

        { field: "Status", editable: false, width: 150 },
        { field: "name", editable: false, headerName: 'Name', width: 300 },
        { field: "description", editable: false, headerName: 'Description', width: 300 },
        { field: "username", editable: false, headerName: 'user', width: 150 },

    ]);

    const pngData = png.map((item, index) => ({

        "itemNo": index,
        "description": item.description,
        "uom": item.uom,
        "quantity": item.quantity,
        "rate": item.rate,
        "amount": item.amount,
        //"_id": item._id,
        "rowId": item._id

    }))
    pngRowId = png.length - 1
    const pngRef = useRef();
    const [rdPng, setRdPng] = useState(pngData)
    const [pngColDefs] = useState([

        { field: "itemNo", editable: false, headerName: 'Item No', width: 75 },
        { field: "description", editable: true, headerName: 'Description', width: 250 },
        { field: "uom", editable: true, headerName: 'Unit', width: 75 },
        { field: "quantity", editable: true, headerName: 'Quantity', width: 150 },
        { field: "rate", editable: true, headerName: 'Rate', width: 150 },
        { field: "amount", editable: true, headerName: 'Amount', width: 150 },
        {
            headerName: 'Actions',
            editable: false,
            width: 75,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                //clicked: function (field) { },
                delClicked: function () { this.api.applyTransaction({ remove: [this.data] }); },
                Id: "png"
            },
        }
    ]);


    const [title, setTitle] = useState(project.title)
    const [description, setDescription] = useState(project.description)
    const [completed, setCompleted] = useState(project.completed)
    const [userId, setUserId] = useState(project.userId)
    const [startDate, setStartDate] = useState(project.startDate)
    const [endDate, setEndDate] = useState(project.endDate)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            // setTitle('')
            // setDescription('')
            // setCompleted(false)
            // setUserId('')
            // setStartDate('')
            // setEndDate('')
            // navigate('/dash/projects')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const onStartDateChanged = (e) => setStartDate(e.target.value)
    const onEndDateChanged = (e) => setEndDate(e.target.value)


    const onCellValueChanged = (e) => {
        console.log('onCellValueChanged-rdAct:' + JSON.stringify(rdAct))
    }
    const onRowDblClicked = (e) => {
        console.log('onRowClicked-activity:' + JSON.stringify(rdAct))
        navigate(`/dash/activities/${e.data._id}`)
    }
    const onPngCellValueChanged = (e) => {
        console.log('onPngCellValueChanged-rowData:' + JSON.stringify(rdPng))
    }
    const onPngRowDblClicked = (e) => {
        console.log('onPngRowDblClicked-PNG:' + JSON.stringify(rdPng))
    }
    const onNewActPropClicked_good = (e) => {
        e.preventDefault()
        rowId = rowId + 1
        let newRdAct = [...rdAct, {
            "Status": null,
            "name": null,
            "description": null,
            "username": null,
            "_id": "new",
            "rowId": 'new' + rowId.toString()
        }]
        setRdAct(newRdAct)
        console.log(JSON.stringify(newRdAct))
    }
    const [seen, setSeen] = useState(false)

    function togglePop() {
        setSeen(!seen);
    };
    const onSaveActivityClicked = async (e) => {
        let process = {}
        let duration = {}
        let eActivity = {}

        e.preventDefault()
        // if (canSave) {
        // eActivity.name = name
        // eActivity.description = description
        // eActivity.startDate = startDate
        // eActivity.endDate = endDate
        // eActivity.completed = completed
        // eActivity.userId = userId
        // process.uom = processUOM
        // process.quantity = processQuantity
        // eActivity.process = process
        // duration.uom = durationUOM
        // duration.quantity = durationQuantity
        // eActivity.duration = duration
        // eActivity.resources = rowData
        // console.log(eActivity)
        // console.log(JSON.stringify(eActivity))
        // await addNewActProp(eActivity)
        // }
    }

    const onNewPngClicked = (e) => {
        e.preventDefault()
        pngRowId = pngRowId + 1
        let newRdPng = [...rdPng, {
            "itemNo": pngRowId,
            "description": null,
            "uom": null,
            "quantity": 0,
            "rate": 0,
            "amount": 0,
            "rowId": 'new' + pngRowId.toString()
        }]
        setRdPng(newRdPng)
        console.log(JSON.stringify(newRdPng))
    }

    const canSave = [userId].every(Boolean) && !isLoading

    const onSaveProjectClicked = async (e) => {
        e.preventDefault()
        let eProject = {}
        // let ePng = rdPng.map({

        // })

        if (canSave) {
            eProject._id = project._id
            eProject.title = title
            eProject.description = description
            eProject.completed = completed
            eProject.startDate = startDate
            eProject.endDate = endDate
            eProject.userId = userId
            eProject.png = rdPng
            //eProject.active = active

            console.log(eProject)
            console.log(JSON.stringify(eProject))
            await updateProject(eProject)
        }
    }

    const onDeleteProjectClicked = async () => {
        await deleteProject({ id: project._id })
    }

    const created = new Date(project.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(project.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

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
    // const validDescriptionClass = !description ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="btn btn-danger"
                title="Delete"
                onClick={onDeleteProjectClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>

        )
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <div className="container grid_system" style={{ fontSize: '12px', borderTop: "1px solid blue", borderLeft: "1px solid blue", borderBottom: "1px solid blue", borderRight: "1px solid blue" }}>
                <div className="row">
                    <br />
                </div>
                <form onSubmit={e => e.preventDefault()}>
                    <div className="row" style={{ border: "0px" }}>

                        <div className="col-sm-10" style={{ border: "0px" }}><h5>Edit Project #{project.title}</h5></div>
                        <div className="form-group col-sm-2 ct-header__nav" style={{ border: "0px" }}>
                            <button
                                className="btn btn-primary"
                                title="Save"
                                onClick={onSaveProjectClicked}
                                disabled={!canSave}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                            {deleteButton}
                        </div>
                    </div>
                    <div className="form-group row" style={{ border: "0px" }}>
                        <div className="col-sm-2" style={{ border: "0px" }}><b>Project Title:</b></div>
                        <div className="col-sm-6" style={{ border: "0px" }} >
                            <input
                                className="form-control"
                                id="title"
                                name="title"
                                type="description"
                                placeholder="Project Title"
                                autoComplete="off"
                                value={title}
                                onChange={onTitleChanged}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ border: "0px" }}>
                        <div className="col-sm-2" style={{ border: "0px" }}><b>Description:</b></div>
                        <div className="col-sm-6" style={{ border: "0px" }}>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                placeholder="Description"
                                rows="4"
                                value={description}
                                onChange={onDescriptionChanged}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2" style={{ border: "0px" }}><b>Start / End Dates:</b></div>
                        <div className="col-md-3" style={{ border: "0px" }}>
                            <Form.Group controlId="startDate">
                                <Form.Control
                                    type="date"
                                    value={startDate ? dateForPicker(startDate) : ''}
                                    placeholder={startDate ? dateForPicker(startDate) : "dd-mm-yyyy"}
                                    onChange={onStartDateChanged}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3" style={{ border: "0px" }}>
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
                    <div className="form-group row" style={{ border: "0px" }}>
                        <div className="col-sm-10" style={{ border: "0px" }}><h6>P &G</h6></div>
                        <div className="col-sm-2 ct-header__nav" style={{ border: "0px", paddingBottom: "2px", paddingRight: "35px" }} >
                            <button
                                className="btn btn-primary btn-sm"
                                title="New Resources"
                                onClick={onNewPngClicked}
                            >
                                Add P&G
                            </button>
                        </div>
                        <div className="row">
                            <div className="ag-theme-balham" style={{ height: 300, width: "100%" }}>
                                <AgGridReact
                                    ref={pngRef}
                                    onCellValueChanged={onPngCellValueChanged}
                                    onRowDoubleClicked={onPngRowDblClicked}
                                    onGridReady={(event) => event.api.sizeColumnsToFit()}
                                    //defaultColDef={defaultColDef}
                                    rowData={rdPng}
                                    columnDefs={pngColDefs}>
                                </AgGridReact>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row" style={{ border: "0px" }}>
                        <div className="col-sm-10" style={{ border: "0px" }}><h6>Activities</h6></div>
                        <div className="col-sm-2 ct-header__nav" style={{ border: "0px", paddingBottom: "2px", paddingRight: "35px" }} >

                            <button
                                className="btn btn-primary btn-sm"
                                title="New Resources"
                                onClick={togglePop}
                            >
                                New Activity
                            </button>

                        </div>
                        < div className="row">

                            {seen ? <NewActProp toggle={togglePop} /> : null}

                        </div>
                        <div className="row">
                            <div className="ag-theme-balham" style={{ height: 300, width: "100%" }}>
                                <AgGridReact
                                    ref={activitiesRef}
                                    onCellValueChanged={onCellValueChanged}
                                    onRowDoubleClicked={onRowDblClicked}
                                    onGridReady={(event) => event.api.sizeColumnsToFit()}
                                    defaultColDef={defaultColDef}
                                    rowData={rdAct}
                                    columnDefs={columnDefs}>
                                </AgGridReact>
                            </div>
                        </div>
                    </div>


                    <div className="panel panel-info">

                        <div className="form-group row" style={{ border: "0px" }}>
                            <div className="col-sm-2" style={{ border: "0px" }}> <b>WORK COMPLETE:</b></div>
                            <div className="col-sm-10" style={{ border: "0px" }}>
                                <div className="form-check" style={{ border: "0px" }}>
                                    <input
                                        className="form-check-input"
                                        id="project-completed"
                                        name="completed"
                                        type="checkbox"
                                        checked={completed}
                                        onChange={onCompletedChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        {(!userId)
                            &&
                            <>
                                <div className="form-group row" style={{ border: "0px" }}>
                                    <div className="col-sm-2" style={{ border: "0px" }}> <b>ASSIGNED TO:</b></div>
                                    <div className="col-sm-2" style={{ border: "0px" }}>
                                        <select
                                            id="username"
                                            name="username"
                                            className="form-select"
                                            value={userId}
                                            onChange={onUserIdChanged}
                                        >
                                            {options}
                                        </select>
                                    </div>
                                </div>
                            </>
                        }

                        {(userId)
                            &&
                            <>
                                <div className="form-group row" style={{ border: "0px" }}>
                                    <div className="col-sm-2" style={{ border: "0px" }}> <b>ASSIGNED TO:</b></div>
                                    <div className="col-sm-2" style={{ border: "0px" }}>
                                        <b><label value={userId}>{userId.username}</label></b>
                                    </div>
                                </div>
                            </>
                        }
                        <div className="panel" style={{ border: "0px" }}>
                            <p className=""><span>Created: {created}</span><span style={{ padding: "15px" }} /><span>Updated: {updated}</span></p>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )

    return content
}

export default EditProjectForm