import { useState, useEffect } from "react"
import { useUpdateDailyReportMutation, useDeleteDailyReportMutation } from "./dailyReportsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const EditDailyReportForm = ({ dailyReport, users }) => {

    const { isManager, isAdmin } = useAuth()

    const [updateDailyReport, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateDailyReportMutation()

    const [deleteDailyReport, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteDailyReportMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(dailyReport.title)
    const [text, setText] = useState(dailyReport.text)
    const [completed, setCompleted] = useState(dailyReport.completed)
    const [userId, setUserId] = useState(dailyReport.user)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/dailyReports')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveDailyReportClicked = async (e) => {
        if (canSave) {
            await updateDailyReport({ id: dailyReport.id, user: userId, title, text, completed })
        }
    }

    const onDeleteDailyReportClicked = async () => {
        await deleteDailyReport({ id: dailyReport.id })
    }

    const created = new Date(dailyReport.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(dailyReport.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

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
                onClick={onDeleteDailyReportClicked}
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
                    <h2>Edit DailyReport #{dailyReport.ticket}</h2>
                    <div className="form-group form__action-buttons">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveDailyReportClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>

                <div className="form-group col-md-6">
                    <label htmlFor="dailyReport-title"> Title:</label>
                    <input
                        className="form-control"
                        id="dailyReport-title"
                        name="title"
                        type="text"
                        placeholder="Title"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="dailyReport-text">Text:</label>
                    <textarea
                        className="form-control"
                        id="dailyReport-text"
                        name="text"
                        rows="4"
                        value={text}
                        onChange={onTextChanged}
                    />
                </div>
                <div className="panel panel-info">

                    <div class="form-group row">
                        <div class="col-sm-2"> WORK COMPLETE:</div>
                        <div class="col-sm-10">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    id="dailyReport-completed"
                                    name="completed"
                                    type="checkbox"
                                    checked={completed}
                                    onChange={onCompletedChanged}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="dailyReport-username">ASSIGNED TO:</label>
                        <select
                            id="dailyReport-username"
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

export default EditDailyReportForm