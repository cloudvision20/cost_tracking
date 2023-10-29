import { useGetAttendsQuery } from './attendsApiSlice'
import FrmAttendsForm from './FrmAttendsForm'
import useTitle from '../../hooks/useTitle'
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'

const FrmAttends = () => {

    const activities = useSelector(selectActivity)
    useTitle(`Cost Tracking: Attendances`)
    const { data: res, isSuccess, isError, error } = useGetAttendsQuery();
    const attends = {
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
        content = <FrmAttendsForm res={res} />
        return content
    }
    if (isError) {
        if (error.status === 400) {
            const newRes = {}
            newRes.attends = attends
            // newRes.formType = formType
            newRes.activities = activities
            content = <FrmAttendsForm res={newRes} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmAttends