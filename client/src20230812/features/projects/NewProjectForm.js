import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewProjectMutation } from "./projectsApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FormControl, Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import { dateForPicker, dateFromDateString } from "../../hooks/useDatePicker"

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

let editProject = {}

const NewProjectForm = ({ users }) => {

    const [addNewProject, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewProjectMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [completed, setCompleted] = useState(false)
    const [userId, setUserId] = useState(users[0].id)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setDescription('')
            setCompleted(false)
            setUserId('')
            setStartDate('')
            setEndDate('')
            navigate('/dash/projects')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onCompletedChanged = e => setCompleted(e.target.value ? true : false)
    const onUserIdChanged = e => setUserId(e.target.value)

    const onStartDateChanged = (e) => setStartDate(e.target.value)
    const onEndDateChanged = (e) => setEndDate(e.target.value)

    const canSave = [title, description, userId].every(Boolean) && !isLoading

    const onSaveProjectClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            editProject.title = title
            editProject.description = description
            editProject.completed = completed
            editProject.startDate = startDate
            editProject.endDate = endDate
            editProject.userId = userId

            //editProject.active = active

            console.log(editProject)
            console.log(JSON.stringify(editProject))
            await addNewProject(editProject)
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
    // const validTitleClass = !title ? "form__input--incomplete" : ''
    // const validDescriptionClass = !description ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form onSubmit={onSaveProjectClicked}>
                <div className="panel">
                    <h2>New Project</h2>
                    <div className="form-group dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveProjectClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
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
                <div className="panel panel-info" >
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
                </div>
            </form>
        </>
    )


    return content
}

export default NewProjectForm