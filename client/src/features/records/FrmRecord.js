import { useGetRecordsByTypeQuery } from './recordsApiSlice'
import FrmRecordForm from './FrmRecordForm'
import useTitle from '../../hooks/useTitle'

const FrmRecord = ({ formType }) => {
    useTitle('Cost Tracking: Record Record')

    const form_Type = formType ? formType : 'Consumables'
    const { data: res, isSuccess, isError, error } = useGetRecordsByTypeQuery(form_Type);
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
        content = <FrmRecordForm res={res} />
        return content
    }
    if (isError) {
        if (error.status === 400) {
            const newRes = {}
            newRes.records = records
            newRes.formType = formType
            content = <FrmRecordForm res={newRes} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmRecord