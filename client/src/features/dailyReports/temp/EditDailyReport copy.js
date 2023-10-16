import { useParams } from 'react-router-dom'
import EditDailyReportForm from './EditDailyReportForm'
import { useGetDailyReportByIdQuery } from './dailyReportsApiSlice'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const EditDailyReport = () => {
    useTitle('Cost Tracking: Edit DailyReport')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    // const { dailyReport } = useGetDailyReportsQuery("dailyReportsList", {
    //     selectFromResult: ({ data }) => ({
    //         dailyReport: data?.entities[id]
    //     }),
    // })

    // const { users } = useGetUsersQuery("usersList", {
    //     selectFromResult: ({ data }) => ({
    //         users: data?.ids.map(id => data?.entities[id])
    //     }),
    // })
    const { data: res, isSuccess } = useGetDailyReportByIdQuery(id);

    let content

    if (isSuccess) {

        // if (!res.dailyReport || !res.users?.length) return <PulseLoader color={"#FFF"} />

        if (!isManager && !isAdmin) {
            if (res.dailyReport.userId.username !== username) {
                return <p className="errmsg">No access</p>
            }
        }
        content = <EditDailyReportForm res={res} />
    }
    return content
}
export default EditDailyReport