import { useParams } from 'react-router-dom'
import EditDailyReportForm from './EditDailyReportForm'
import { useGetDailyReportsQuery } from './dailyReportsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditDailyReport = () => {
    useTitle('Cost Tracking: Edit DailyReport')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { dailyReport } = useGetDailyReportsQuery("dailyReportsList", {
        selectFromResult: ({ data }) => ({
            dailyReport: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!dailyReport || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isManager && !isAdmin) {
        if (dailyReport.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditDailyReportForm dailyReport={dailyReport} users={users} />

    return content
}
export default EditDailyReport