import { useGetActivitiesAllQuery } from "../activities/activitiesApiSlice"
import AttendancesUploadForm from "./AttendancesUploadForm"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const AttendancesUpload = () => {
    useTitle('Cost Tracking: Attendance Upload')
    const {
        data: activities,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetActivitiesAllQuery()

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        content = <AttendancesUploadForm activities={activities} />
    }

    return content
}
export default AttendancesUpload