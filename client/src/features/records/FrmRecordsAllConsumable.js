import { useGetRecordsByTypeActIdQuery } from './recordsApiSlice'
import FrmRecordsForm from './FrmRecordsAllForm'
import useTitle from '../../hooks/useTitle'
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'

const FrmRecords = ({ params }) => {

    const activities = useSelector(selectActivity)
    // const activityId = activities?.current?.activityId ? activities?.current?.activityId : ''
    const activityId = ''
    const form_Type = params.formType ? params.formType : 'Consumables'
    // let param = {}
    // param.activityId = activityId
    // param.params.formType = params.formType
    useTitle(`Cost Tracking: ${form_Type} Record`)
    const { data: res, isSuccess, isError, error } = useGetRecordsByTypeActIdQuery(params);
    const records = {
        "_id": "new",
        "employeeId": null,
        "type": null,
        "details": null,
        "job": null,
        "terminal": null,
        "userId": null,
        "amount": 0,
        "amtType": null,
        "dateTime": null,
        "description": null,
        "fileInfo": [],
        "formId": null,
        "posted": false,
        "unit": null
    }

    let content
    if (isSuccess) {
        content = <FrmRecordsForm res={res} />
        return content
    }
    if (isError) {
        if (error.status === 400) {
            const newRes = {}
            newRes.records = records
            newRes.formType = params.formType
            newRes.activities = activities.activities
            content = <FrmRecordsForm res={newRes} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmRecords