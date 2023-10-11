import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetDailyReportsQuery } from './dailyReportsApiSlice'
import { memo } from 'react'

const DailyReport = ({ dailyReportId }) => {

    const { dailyReport } = useGetDailyReportsQuery("dailyReportsList", {
        selectFromResult: ({ data }) => ({
            dailyReport: data?.entities[dailyReportId]
        }),
    })

    const navigate = useNavigate()

    if (dailyReport) {
        const created = new Date(dailyReport.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(dailyReport.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/dailyReports/${dailyReportId}`)

        return (
            <tr className="">
                <td className="">
                    {dailyReport.completed
                        ? <span className="">Completed</span>
                        : <span className="">Open</span>
                    }
                </td>
                <td className="">{created}</td>
                <td className="">{updated}</td>
                <td className="">{dailyReport.activityId}</td>
                <td className="">{dailyReport.username}</td>

                <td className="">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedDailyReport = memo(DailyReport)

export default memoizedDailyReport