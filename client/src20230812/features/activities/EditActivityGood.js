import { useParams } from 'react-router-dom';
import EditActivityForm from './EditActivityForm'
import { useGetProjectsQuery } from '../projects/projectsApiSlice'
import { useGetActivitiesQuery } from './activitiesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'

import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const EditActivity = () => {
    useTitle('Cost Tracking: Projects List')

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

    const {
        data: projects,
        isLoading,
        isSuccess,
        isError,
        error

    } = useGetProjectsQuery('projectsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    let content



    if (isSuccess) {
        const { ids, entities } = projects

        let projs = ids.map(projectId => entities[projectId])

        if (!activity || !users?.length) return <PulseLoader color={"#FFF"} />


        if (!isManager && !isAdmin) {
            if (activity.username !== username) {
                return <p className="errmsg">No access</p>
            }
        }

        content = <EditActivityForm projects={projs} activity={activity} users={users} />
    }

    return content
}
export default EditActivity

