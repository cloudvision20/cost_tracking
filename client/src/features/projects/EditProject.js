import { useParams } from 'react-router-dom'
import EditProjectForm from './EditProjectForm'
import { useGetProjectByIdQuery, useGetProjectsQuery } from './projectsApiSlice'

import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditProject = () => {
    useTitle('Cost Tracking: Edit Project')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { data: res, isSuccess } = useGetProjectByIdQuery(id);

    let content

    if (isSuccess) {

        if (!res.project || !res.users?.length) return <PulseLoader color={"#FFF"} />


        if (!isManager && !isAdmin) {
            if (res.project.username !== username) {
                return <p className="errmsg">No access</p>
            }
        }

        content = <EditProjectForm startActivities={res.activities} project={res.project[0]} users={res.users} types={res.types} />
    }

    return content
}
export default EditProject