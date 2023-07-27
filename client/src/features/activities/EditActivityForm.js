import { useState, useEffect } from "react"
import { useUpdateActivityMutation, useDeleteActivityMutation } from "./activitiesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

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

    const [name, setName] = useState(activity.activityDetails.name)
    const [description, setDescription] = useState(activity.activityDetails.description)
    const [title, setTitle] = useState(activity.title)
    const [text, setText] = useState(activity.text)
    const [completed, setCompleted] = useState(activity.completed)
    const [userId, setUserId] = useState(activity.user)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setName('')
            setDescription('')
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/activities')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveActivityClicked = async (e) => {
        if (canSave) {
            await updateActivity({ id: activity.id, user: userId, title, text, completed })
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
    // const validTitleClass = !title ? "form__input--incomplete" : ''
    // const validTextClass = !text ? "form__input--incomplete" : ''

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
                    <h2>Edit Activity #{activity.ticket}</h2>
                    <div className="form-group form__action-buttons">
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
                    <div className="col-sm-2">Name:</div>
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
                    <div className="col-sm-2">Description:</div>
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
                    <div className="col-sm-2">Title:</div>
                    <div className="col-sm-6">
                        <input
                            className="form-control"
                            id="activity-title"
                            name="title"
                            type="text"
                            placeholder="Title"
                            autoComplete="off"
                            value={title}
                            onChange={onTitleChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Text:</div>
                    <div className="col-sm-6">
                        <textarea
                            className="form-control"
                            id="activity-text"
                            name="text"
                            rows="4"
                            value={text}
                            onChange={onTextChanged}
                        />
                    </div>
                </div>
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
                                id="activity-username"
                                name="username"
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
                        {/* <p className=""></p> */}
                    </div>
                </div>

            </form>
        </>
    )

    return content
}

export default EditActivityForm