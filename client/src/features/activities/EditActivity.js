import { useParams } from 'react-router-dom';
import EditActivityForm from './EditActivityForm'
import { useGetActivityByIdQuery } from './activitiesApiSlice'

import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const EditActivity = () => {
    useTitle('Cost Tracking: Edit Activity')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { data: res, isSuccess } = useGetActivityByIdQuery(id);

    let content

    if (isSuccess) {

        if (!res.activity || !res.users?.length) return <PulseLoader color={"#FFF"} />

        if (!isManager && !isAdmin) {
            if (res.activity.userId.username !== username) {
                return <p className="errmsg">No access</p>
            }
        }
        content = <EditActivityForm dailyReports={res.dailyReports} projects={res.projects} activity={res.activity[0]} users={res.users} />

    }

    return content
}
export default EditActivity

