import NewDailyReportForm from './NewDailyReportForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const NewDailyReport = () => {
    useTitle('Cost Tracking: New DailyReport')

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!users?.length) return <PulseLoader color={"#FFF"} />

    const content = <NewDailyReportForm users={users} />

    return content
}
export default NewDailyReport