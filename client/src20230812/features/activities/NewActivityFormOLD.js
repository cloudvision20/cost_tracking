import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewActivityMutation } from "./activitiesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

const NewActivityForm = ({ users }) => {

    const [addNewActivity, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewActivityMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/activities')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveActivityClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewActivity({ user: userId, title, text })
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
    // const validTextClass = !text ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form onSubmit={onSaveActivityClicked}>
                <div className="panel">
                    <h2>New Activity</h2>
                    <div className="form-group form__action-buttons">
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

                <div className="form-group col-md-6">
                    <label htmlFor="activity-title"> Title:</label>
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
                <div className="form-group col-md-6">
                    <label htmlFor="text">Text:</label>
                    <textarea
                        className="form-control"
                        id="text"
                        name="text"
                        rows="4"
                        value={text}
                        onChange={onTextChanged}
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

export default NewActivityForm