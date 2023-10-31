import { useGetAllUsersQuery } from './usersApiSlice'
import FrmUsersForm from './FrmUsersForm'
import useTitle from '../../hooks/useTitle'
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'

const FrmUsers = () => {

    const activities = useSelector(selectActivity)
    useTitle(`Cost Tracking: Userances`)
    const { data: res, isSuccess, isError, error } = useGetAllUsersQuery();
    const users = {
        "_id": "new",
        "userId": null,
        "activityId": null,
        "employeeId": null,
        "employeeName": null,
        "clockType": null,
        "date": null,
        "time": null,
        "weekday": null,
        "dateTime": null,
        "terminal": null
    }

    let content
    if (isSuccess) {
        content = <FrmUsersForm res={res} />
        return content
    }
    if (isError) {
        if (error.status === 400) {
            const newRes = {}
            newRes.users = users
            // newRes.formType = formType
            newRes.activities = activities
            content = <FrmUsersForm res={newRes} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmUsers