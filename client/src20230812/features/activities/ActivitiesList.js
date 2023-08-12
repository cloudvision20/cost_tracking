import { useGetActivitiesQuery } from "./activitiesApiSlice"
import Activity from "./Activity"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const ActivitiesList = () => {
    useTitle('Cost Tracking: Activities List')

    const { username, isManager, isAdmin } = useAuth()

    const {
        data: activities,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetActivitiesQuery('activitiesList', {
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
        const { ids, entities } = activities

        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(activityId => entities[activityId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(activityId => <Activity key={activityId} activityId={activityId} />)

        content = (
            <table className="table table-striped table-hover">
                <thead className="">
                    <tr>
                        <th scope="col" className="">Status</th>
                        <th scope="col" className="">Name</th>
                        <th scope="col" className="">Description</th>
                        <th scope="col" className="">Created</th>
                        <th scope="col" className="">Updated</th>
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
export default ActivitiesList