import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewProjectMutation } from "./projectsApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

const NewProjectForm = ({ users }) => {

    const [addNewProject, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewProjectMutation()

    const navigate = useNavigate()

    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    useEffect(() => {
        if (isSuccess) {
            setProjectName('')
            setDescription('')
            setUserId('')
            navigate('/dash/projects')
        }
    }, [isSuccess, navigate])

    const onProjectNameChanged = e => setProjectName(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [projectName, description, userId].every(Boolean) && !isLoading

    const onSaveProjectClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewProject({ user: userId, projectName, description })
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
    // const validProjectNameClass = !projectName ? "form__input--incomplete" : ''
    // const validDescriptionClass = !description ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form onSubmit={onSaveProjectClicked}>
                <div className="panel">
                    <h2>New Project</h2>
                    <div className="form-group form__action-buttons">
                        <button
                            className="btn btn-primary"
                            projectName="Save"
                            onClick={onSaveProjectClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="projectName"> Project Name:</label>
                    <input
                        className="form-control"
                        id="projectName"
                        name="projectName"
                        type="description"
                        placeholder="Project Name"
                        autoComplete="off"
                        value={projectName}
                        onChange={onProjectNameChanged}
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
                    <div className="form-group col-md-2">
                        <label htmlFor="username">ASSIGNED TO:</label>
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
            </form>
        </>
    )


    return content
}

export default NewProjectForm