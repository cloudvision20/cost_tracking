import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetActivitiesQuery } from './activitiesApiSlice'
import { memo } from 'react'

const Activity = ({ activityId }) => {

    const { activity } = useGetActivitiesQuery("activitiesList", {
        selectFromResult: ({ data }) => ({
            activity: data?.entities[activityId]
        }),
    })

    const navigate = useNavigate()

    if (activity) {
        const created = new Date(activity.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(activity.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/activities/${activityId}`)

        return (
            <tr className="">
                <td className="">
                    {activity.completed
                        ? <span className="">Completed</span>
                        : <span className="">Open</span>
                    }
                </td>
                <td className="">{activity.activityDetails.name}</td>
                <td className="">{activity.activityDetails.description}</td>
                <td className="">{created}</td>
                <td className="">{updated}</td>
                <td className="">{activity.title}</td>
                <td className="">{activity.username}</td>

                <td className="">
                    <button
                        className="btn btn-primary"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedActivity = memo(Activity)

export default memoizedActivity