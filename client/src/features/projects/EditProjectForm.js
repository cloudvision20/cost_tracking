import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useUpdateProjectMutation, useDeleteProjectMutation } from "./projectsApiSlice"
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
let editProject = {}

const EditProjectForm = ({ activities, project, users }) => {

    const { isManager, isAdmin } = useAuth()

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

    const data = Array.from(activities).map((activity, index) => ({
        "Status": activity.completed ? "Completed" : "Open",
        "name": activity.name,
        "description": activity.description,
        "username": activity.userId.username,
        "_id": activity._id,
        "rowId": activity._id
    }))
    const activitiesRef = useRef();
    const [rowData, setRowData] = useState(data)
    const [columnDefs] = useState([

        { field: "Status", editable: false },
        { field: "name", editable: false },
        { field: "description", editable: false },
        { field: "username", editable: false }

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
        console.log('onCellValueChanged-rowData:' + JSON.stringify(rowData))
    }
    const onRowDblClicked = (e) => {
        console.log('onRowClicked-activity:' + JSON.stringify(rowData))
        navigate(`/dash/activities/${e.data._id}`)
    }
    const onNewActivityClicked = (e) => {
        e.preventDefault()
        rowId = rowId + 1
        let newRowData = [...rowData, {
            "Status": null,
            "name": null,
            "description": null,
            "username": null,

            "rowId": 'new' + rowId.toString()
        }]
        setRowData(newRowData)
        console.log(JSON.stringify(newRowData))
    }

    const canSave = [userId].every(Boolean) && !isLoading

    const onSaveProjectClicked = async (e) => {
        //e.preventDefault()
        if (canSave) {
            editProject._id = project._id
            editProject.title = title
            editProject.description = description
            editProject.completed = completed
            editProject.startDate = startDate
            editProject.endDate = endDate
            editProject.userId = userId

            //editProject.active = active

            console.log(editProject)
            console.log(JSON.stringify(editProject))
            await updateProject(editProject)
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

                    <div className="panel-heading" style={{ border: "0px" }}><b>Activities</b></div>
                    <div className="container-sm" style={{ border: "0px" }}>

                        <div className="panel-group" style={{ border: "0px" }}>
                            <div className="panel panel-default">
                                <div className="form-group  ct-header__nav">
                                    <button
                                        className="btn btn-primary"
                                        title="New Resources"
                                        onClick={onNewActivityClicked}
                                    >
                                        Add Activities
                                    </button>
                                </div>
                                <div className="panel-body">
                                    <div className="ag-theme-balham" style={{ height: 300, width: "100%" }}>
                                        <AgGridReact
                                            ref={activitiesRef}
                                            onCellValueChanged={onCellValueChanged}
                                            onRowDoubleClicked={onRowDblClicked}
                                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                                            defaultColDef={defaultColDef}
                                            rowData={rowData}
                                            columnDefs={columnDefs}>
                                        </AgGridReact>
                                    </div>
                                </div>
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
                        <div className="form-group row" style={{ border: "0px" }}>
                            <div className="col-sm-2" style={{ border: "0px" }}> <b>ASSIGNED TO:</b></div>
                            <div className="col-sm-2" style={{ border: "0px" }}>
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