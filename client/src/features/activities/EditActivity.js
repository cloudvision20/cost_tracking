import { useParams } from 'react-router-dom'
import EditActivityForm from './EditActivityForm'
import { useGetActivitiesQuery } from './activitiesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditActivity = () => {
    useTitle('Cost Tracking: Edit Activity')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { activity } = useGetActivitiesQuery("activitiesList", {
        selectFromResult: ({ data }) => ({
            activity: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!activity || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isManager && !isAdmin) {
        if (activity.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditActivityForm activity={activity} users={users} />

    return content
}
export default EditActivity