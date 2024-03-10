import { useGetRecordsByTypeActIdQuery } from './recordsApiSlice'
import FrmRecordsForm from './FrmRecordsForm'
import useTitle from '../../hooks/useTitle'
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'

const FrmRecords = ({ formType }) => {

    // const activities = useSelector(selectActivity)
    // const form_Type = formType ? formType : 'Consumables'
    // useTitle(`Cost Tracking: ${form_Type} Record`)
    // const { data: res, isSuccess, isError, error } = useGetRecordsByTypeQuery(form_Type);

    const activities = useSelector(selectActivity)
    const activityId = activities?.current?.activityId ? activities?.current?.activityId : ''
    //const activityId = ''
    const form_Type = formType ? formType : 'Consumables'
    let param = {}
    param.activityId = activityId
    param.formType = formType
    useTitle(`Cost Tracking: ${form_Type} Record`)
    const { data: res, isSuccess, isError, error } = useGetRecordsByTypeActIdQuery(param);
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
            newRes.formType = formType
            newRes.activities = activities
            content = <FrmRecordsForm res={newRes} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmRecords