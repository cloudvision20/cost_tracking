import { useState, useEffect } from "react"
import { useUpdateProjectMutation, useDeleteProjectMutation } from "./projectsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

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
    const [userId, setUserId] = useState(project.user)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setTitle('')
            setDescription('')
            setUserId('')
            navigate('/dash/projects')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, description, userId].every(Boolean) && !isLoading

    const onSaveProjectClicked = async (e) => {
        if (canSave) {
            await updateProject({ id: project.id, user: userId, title, description, completed })
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
                    <div className="form-group form__action-buttons">
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

                <div className="form-group col-md-6">
                    <label htmlFor="title"> Project Name:</label>
                    <input
                        className="form-control"
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Project Name"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="4"
                        value={description}
                        onChange={onDescriptionChanged}
                    />
                </div>
                <div className="panel panel-info">

                    <div class="form-group row">
                        <div class="col-sm-2"> WORK COMPLETE:</div>
                        <div class="col-sm-10">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    id="project-completed"
                                    name="completed"
                                    type="checkbox"
                                    checked={completed}
                                    onChange={onCompletedChanged}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="project-username">ASSIGNED TO:</label>
                        <select
                            id="project-username"
                            name="username"
                            className="form-control"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="">
                        <p className="">Created: {created}</p>
                        <p className="">Updated: {updated}</p>
                    </div>
                </div>

            </form>
        </>
    )

    return content
}

export default EditProjectForm