import { useParams } from 'react-router-dom';
import EditActivityForm from './EditActivityForm'
import { useGetProjectsQuery } from '../projects/projectsApiSlice'
import { useGetActivitiesQuery, useGetActivityByIdQuery } from './activitiesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetDailyReportsQuery } from '../dailyReports/dailyReportsApiSlice';

import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const EditActivity = () => {
    useTitle('Cost Tracking: Edit Activity')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    // const { activity } = useGetActivitiesQuery("activitiesList", {
    //     selectFromResult: ({ data }) => ({
    //         activity: data?.entities[id]
    //     }),
    // })
    const {
        data: activity,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetActivityByIdQuery(id);
    const { projects } = useGetProjectsQuery("projectsList", {
        selectFromResult: ({ data }) => ({
            projects: data?.ids.map(id => data?.entities[id])
        }),
    })
    // const { dailyReports } = useGetDailyReportsQuery("dailyReportsList", {
    //     selectFromResult: ({ data }) => ({
    //         dailyReports: data?.ids.map(id => data?.entities[id])
    //     }),
    // })
    // const dailyReport = dailyReports.filter((product) => product._id === id)[0]

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })


    // if (!activity || !users?.length) return <PulseLoader color={"#FFF"} />


    // if (!isManager && !isAdmin) {
    //     if (activity.username !== username) {
    //         return <p className="errmsg">No access</p>
    //     }
    // }
    let content

    if (isSuccess) {
        const { ids, entities } = activity

        if (!activity || !users?.length) return <PulseLoader color={"#FFF"} />


        if (!isManager && !isAdmin) {
            if (entities[id].username !== username) {
                return <p className="errmsg">No access</p>
            }
        }
        //
        content = <EditActivityForm projects={projects} activity={entities[id]} users={users} />

    }
    //    const content = <EditActivityForm dailyReport={dailyReport} projects={projects} activity={activity} users={users} />
    // const content = <EditActivityForm projects={projects} activity={activity} users={users} />


    return content
}
export default EditActivity

