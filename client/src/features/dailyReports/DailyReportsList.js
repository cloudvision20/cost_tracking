import { useGetDailyReportsQuery } from "./dailyReportsApiSlice"
import DailyReport from "./DailyReport"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const DailyReportsList = () => {
    useTitle('Cost Tracking: DailyReports List')

    const { username, isManager, isAdmin } = useAuth()

    const {
        data: dailyReports,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDailyReportsQuery('dailyReportsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = dailyReports

        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(dailyReportId => entities[dailyReportId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(dailyReportId => <DailyReport key={dailyReportId} dailyReportId={dailyReportId} />)

        content = (
            <table className="table table-striped table-hover">
                <thead className="">
                    <tr>
                        <th scope="col" className="">Status</th>
                        <th scope="col" className="">Created</th>
                        <th scope="col" className="">Updated</th>
                        <th scope="col" className="">Title</th>
                        <th scope="col" className="">Owner</th>
                        <th scope="col" className="">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default DailyReportsList