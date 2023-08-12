import { useState, useEffect } from "react"
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

let editProject = {}

const EditProjectForm = ({ project, users }) => {

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

    const canSave = [title, description, userId].every(Boolean) && !isLoading

    const onSaveProjectClicked = async (e) => {
        //e.preventDefault()
        if (canSave) {
            editProject._id = project.id
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
        await deleteProject({ id: project.id })
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
            <form onSubmit={e => e.preventDefault()}>
                <div className="panel">
                    <h2>Edit Project #{project.title}</h2>
                    <div className="form-group dash-header__nav">
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
                <div className="form-group row">
                    <div className="col-sm-2"><b>Project Title:</b></div>
                    <div className="col-sm-6">
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
                <div className="form-group row">
                    <div className="col-sm-2"><b>Description:</b></div>
                    <div className="col-sm-6">
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
                <div className="panel panel-info">

                    <div className="form-group row">
                        <div className="col-sm-2"> <b>WORK COMPLETE:</b></div>
                        <div className="col-sm-10">
                            <div className="form-check">
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
                    <div className="panel">
                        <p className=""><span>Created: {created}</span><span style={{ padding: "15px" }} /><span>Updated: {updated}</span></p>
                    </div>
                </div>

            </form>
        </>
    )

    return content
}

export default EditProjectForm