import { useParams } from 'react-router-dom';
import EditActivityForm from './EditActivityForm'
import { useGetProjectsQuery } from '../projects/projectsApiSlice'
import { useGetActivityByIdQuery } from './activitiesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'

import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const EditActivity = () => {
    useTitle('Cost Tracking: Edit Activity')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { data: response, isSuccess } = useGetActivityByIdQuery(id);

    // const { projects } = useGetProjectsQuery("projectsList", {
    //     selectFromResult: ({ data }) => ({
    //         projects: data?.ids.map(id => data?.entities[id])
    //     }),
    // })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    let content

    if (isSuccess) {
        //const { ids, entities } = activity

        if (!response.activity || !users?.length) return <PulseLoader color={"#FFF"} />

        if (!isManager && !isAdmin) {
            if (response.activity.userId.username !== username) {
                return <p className="errmsg">No access</p>
            }
        }
        content = <EditActivityForm projects={response.projects} activity={response.activity[0]} users={users} />

    }

    return content
}
export default EditActivity

