import { useState, useMemo, useRef, useEffect, Component } from "react"
import { useUpdateProjectMutation, useDeleteProjectMutation } from "./projectsApiSlice"
import { useAddNewActivityMutation } from "../activities/activitiesApiSlice"
// import NewActProp from "./NewActPop"
import { useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan, faWindowRestore } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import { Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import { dateForPicker, dateFromDateString } from "../../hooks/useDatePicker"
//import { ActvitiesByProj } from "../../hooks/useActivities"

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// let rowId = 0
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

const EditProjectForm = ({ startActivities, project, users, types }) => {
    //let activities = startActivities
    const [activities, setActivities] = useState(startActivities)
    const { isManager, isAdmin } = useAuth()
    const textStyle = { textAlign: 'left', fontSize: '12px' }

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

    const [saveProject, {
        isSuccess: isSaveSuccess
    }] = useUpdateProjectMutation()

    const [deleteProject, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteProjectMutation()

    const navigate = useNavigate()
    const location = useLocation()
    // let loadState = location?.state?.load

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
            width: 50,
        };
    }, []);


    const data = Array.from(activities).map((activity, index) => ({
        "Status": activity.completed ? "Completed" : "Open",
        "activityType": activity.activityType ? activity.activityType : "mobilization",
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
        { field: "activityType", editable: false, headerName: 'Activity Type', width: 150 },
        { field: "name", editable: false, headerName: 'Name', width: 300 },
        { field: "description", editable: false, headerName: 'Description', width: 300 },
        { field: "username", editable: false, headerName: 'user', width: 150 },

    ]);
    // let acts = {}
    // if (loadState === true) {
    //     if (!acts) { acts = ActvitiesByProj(project._id) }
    //     // window.alert(JSON.stringify(acts))
    //     if (acts?.activities) {
    //         const dat = Array.from(acts.activities).map((activity, index) => ({
    //             "Status": activity.completed ? "Completed" : "Open",
    //             "name": activity.name,
    //             "description": activity.description,
    //             "username": activity.userId.username,
    //             "_id": activity._id,
    //             "rowId": activity._id
    //         }))
    //         setRdAct(dat)
    //         activitiesRef.current.api.refreshCells()
    //         loadState = false
    //     }

    // }
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
    const [userId, setUserId] = useState(project.userId._id)
    const [startDate, setStartDate] = useState(project.startDate)
    const [endDate, setEndDate] = useState(project.endDate)

    useEffect(() => {
        if (location?.state?.load === true) {
            window.location.reload()
            navigate(location.pathname, {});
        }
        //window.location.reload();

        // if (isSuccess || isDelSuccess) {
        //     // setTitle('')
        //     // setDescription('')
        //     // setCompleted(false)
        //     // setUserId('')
        //     // setStartDate('')
        //     // setEndDate('')
        //     // navigate('/dash/projects')
        // }

    }, [])

    const onTitleChanged = e => setTitle(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const onStartDateChanged = (e) => setStartDate(e.target.value)
    const onEndDateChanged = (e) => setEndDate(e.target.value)


    const onCellValueChanged = (e) => {
        console.log('onCellValueChanged-rdAct:' + JSON.stringify(rdAct))
    }

    const onRowDblClicked = async (e) => {
        console.log('onRowDblClicked-activity:' + JSON.stringify(rdAct))
        let eProject = {}
        // if (canSave) {
        eProject._id = project._id
        eProject.title = title
        eProject.description = description
        eProject.completed = completed
        eProject.startDate = startDate
        eProject.endDate = endDate
        eProject.userId = userId
        eProject.png = rdPng
        //eProject.active = active
        await saveProject(eProject)    // }

        if (isSaveSuccess) {
            navigate(`/dash/activities/${e.data._id}`, { state: { url: location.pathname } })
        }
    }
    const onPngCellValueChanged = (e) => {
        console.log('onPngCellValueChanged-rowData:' + JSON.stringify(rdPng))
    }
    const onPngRowDblClicked = (e) => {
        console.log('onPngRowDblClicked-PNG:' + JSON.stringify(rdPng))
    }
    /********************************************************************
     * 
     *     New Activity
     * 
     *******************************************************************/
    const [addNewActivity, {
        isLoading: isLoadingNewActivity,
        isSuccess: isSuccessNewActivity,
        isError: isErrorNewActivity,
        error: errorNewQActivity
    }] = useAddNewActivityMutation()

    const [name, setName] = useState('')
    const [aDescription, setADescription] = useState('')
    const [aCompleted, setACompleted] = useState(false)
    // const [userId, setUserId] = useState(usersId)
    // const [projectId, setProjectId] = useState(projectId)
    const [processUOM, setProcessUOM] = useState('')
    const [processQuantity, setProcessQuantity] = useState('')
    const [durationUOM, setDurationUOM] = useState('')
    const [durationQuantity, setDurationQuantity] = useState('')
    const [aStartDate, setAStartDate] = useState('')
    const [aEndDate, setAEndDate] = useState('')
    const [activityType, setActivityType] = useState('mobilization')

    const onNameChanged = (e) => setName(e.target.value)
    const onADescriptionChanged = (e) => setADescription(e.target.value)
    const onProcessUOMChanged = (e) => setProcessUOM(e.target.value)
    const onProcessQuantityChanged = (e) => setProcessQuantity(e.target.value)
    const onDurationUOMChanged = (e) => setDurationUOM(e.target.value)
    const onDurationQuantityChanged = (e) => setDurationQuantity(e.target.value)
    const onActivityTypeChanged = (e) => setActivityType(e.target.value)
    const onAStartDateChanged = (e) => setAStartDate(e.target.value)
    const onAEndDateChanged = (e) => setAEndDate(e.target.value)


    const clearForm = () => {
        setName('')
        setADescription('')
        setProcessUOM('')
        setProcessQuantity('')
        setDurationQuantity('')
        setDurationUOM('')
        setAStartDate('')
        setAEndDate('')

    }

    const onSaveActivityClicked = async (e) => {

        e.preventDefault()


        let eActivity = {}
        let process = {}
        let duration = {}
        // e.preventDefault()
        // if (canSave) {
        eActivity.name = name
        eActivity.description = aDescription
        eActivity.startDate = aStartDate ? aStartDate : ''
        eActivity.endDate = aEndDate ? aEndDate : ''
        eActivity.completed = aCompleted
        eActivity.userId = userId
        eActivity.projectId = project._id
        process.uom = processUOM ? processUOM : ''
        process.quantity = processQuantity ? processQuantity : 0
        eActivity.process = process
        duration.uom = durationUOM ? durationUOM : ''
        duration.quantity = durationQuantity ? durationQuantity : 0
        eActivity.activityType = activityType
        eActivity.duration = duration
        // eActivity.resources = rowData
        console.log(eActivity)
        console.log(JSON.stringify(eActivity))
        await addNewActivity(eActivity).then((result) => {



            eActivity = {}

            const dat = Array.from([...activities, result.data.act]).map((activity, index) => ({
                "Status": activity.completed ? "Completed" : "Open",
                "name": activity.name,
                "description": activity.description,
                "username": activity.userId.username,
                "_id": activity._id,
                "rowId": activity._id
            }))
            setRdAct(dat)
            activitiesRef.current.api.refreshCells()
            setActivities([...activities, result.data.act])

            clearForm()
            togglePop()
        })

    }

    const [seen, setSeen] = useState(false)

    function togglePop() {

        // clearForm()
        setSeen(!seen)
        // console.log(JSON.stringify(ActvitiesByProj(project._id)))
    };
    // function loadActivities() {
    //     let [acts, setActs] = ActvitiesByProj(project._id)
    //     setActivities(acts)
    // }

    const onNewActivityClicked = async (e) => {
        e.preventDefault()
        if (!seen) {
            e.target.innerText = "Cancel"
            e.target.className = "btn btn-danger btn-sm"
        } else {
            e.target.innerText = "New Activity"
            e.target.className = "btn btn-primary btn-sm"
        }
        togglePop()
        activitiesRef.current.api.refreshCells()


    }

    // if (isSuccessNewActivity) {
    //     //setActivities([...activities,result])
    //     clearForm()
    //     togglePop()
    // }

    /**************************************************************** */
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
        if (window.confirm("Confirm Delete Project?")) {
            await deleteProject({ id: project._id })
        }
    }

    const created = new Date(project.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(project.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (<option key={user.id} value={user.id} > {user.username}</option >)
    })

    const typeOptions = types.map(item => {
        return (<option key={item._id} value={item.name}> {item.name}</option>)
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
                    {/* starting P&G  */}
                    <div className="container grid_system" style={{ fontSize: '12px', border: "0PX" }}>
                        <br />
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
                        <br />
                    </div>
                    <br />
                    {/* starting activities section */}
                    <div className="container grid_system" style={{ fontSize: '12px', border: "1px solid lightblue" }}>
                        <br />
                        <div className="form-group row" style={{ border: "0px" }}>
                            <div className="col-sm-10" style={{ border: "0px" }}><h6>Activities</h6></div>
                            <div className="col-sm-2 ct-header__nav" style={{ border: "0px", paddingBottom: "2px", paddingRight: "35px" }} >

                                <button id="btnNewActivity"
                                    className="btn btn-primary btn-sm"
                                    title="New Resources"
                                    onClick={onNewActivityClicked}
                                >
                                    New Activity
                                </button>

                            </div>
                        </div>
                        < div className="row" style={{ marginLeft: "20px", marginRight: "20px" }}>

                            {/* {seen ? (<NewActProp userId={project.userId._id} projectId={project._id} toggle={togglePop} />) : null} */}
                            {/* <p>{JSON.stringify(ActvitiesByProj(project._id))}</p> */}
                            {(seen)
                                &&
                                <div className="container grid_system" style={{ fontSize: '11px', border: "1px solid lightgray" }}>
                                    {/* <form onSubmit={e => e.preventDefault()}> */}
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
                                                        <div className=" col-sm-6">
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
                                                        <div className=" col-sm-1" style={{ paddingLeft: '10px' }}><b>Type:</b></div>
                                                        <div className=" col-sm-3">
                                                            <select id="projectid" name="projectid"
                                                                style={textStyle}
                                                                className="form-control"
                                                                value={activityType}
                                                                onChange={onActivityTypeChanged}
                                                            >
                                                                {typeOptions}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className=" col-sm-2"><b>Description:</b></div>
                                                        <div className=" col-sm-10">
                                                            <textarea
                                                                className="form-control"
                                                                id="activity-aDescription"
                                                                name="aDescription"
                                                                rows="3"
                                                                style={{ fontSize: '11px' }}
                                                                value={aDescription}
                                                                onChange={onADescriptionChanged}
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
                                                            <Form.Group controlId="aStartDate">
                                                                <Form.Control
                                                                    type="date"
                                                                    style={{ fontSize: '11px' }}
                                                                    value={aStartDate ? dateForPicker(aStartDate) : ''}
                                                                    placeholder={aStartDate ? dateForPicker(aStartDate) : "dd-mm-yyyy"}
                                                                    onChange={onAStartDateChanged}
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                        <div className=" col-md-5">
                                                            <Form.Group controlId="aEndDate">
                                                                <Form.Control
                                                                    type="date"
                                                                    style={{ fontSize: '11px' }}
                                                                    value={aEndDate ? dateForPicker(aEndDate) : ''}
                                                                    placeholder={aEndDate ? dateForPicker(aEndDate) : "dd-mm-yyyy"}
                                                                    onChange={onAEndDateChanged}
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
                                    {/* </form> */}
                                </div>
                            }
                            {(!seen)
                                &&
                                <></>
                            }



                        </div>
                        <br />
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
                        <br />
                    </div>


                    {/* <div className="panel panel-info">

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
                    </div> */}
                    <div className="panel panel-info" style={{ fontSize: '12px' }}>

                        <div className="form-group row">
                            <div className=" col-sm-1"> <b>COMPLETED:</b></div>
                            <div className=" col-sm-1">
                                <div className="form-check">
                                    <input className="form-check-input" id="activity-completed" name="completed"
                                        type="checkbox"
                                        checked={completed}
                                        onChange={onCompletedChanged}
                                    />
                                </div>
                            </div>
                            <div className=" col-sm-1"><b>ASSIGNED:</b></div>
                            <div className=" col-sm-2">
                                <select
                                    id="userid"
                                    name="userid"
                                    style={{ border: '0px', fontSize: '12px', padding: '0px' }}
                                    className="form-control"
                                    value={userId._id}
                                    onChange={onUserIdChanged}
                                >
                                    {options}
                                </select>
                            </div>
                            <div className=" col-sm-7"><span>Created: {created}</span><span style={{ padding: "15px" }} /><span>Updated: {updated}</span></div>
                        </div>
                    </div>
                </form>
                <br />
            </div>
            <br />
            <br />
        </>
    )

    return content
}

export default EditProjectForm