import { useEffect } from "react"
import { useLazyGetActivityByTypeQuery } from '../../activities/activitiesApiSlice'
import FrmRecordForm from '../FrmRecordForm'
import useTitle from '../../../hooks/useTitle'
const FrmRecord = ({ formType }) => {

    const form_Type = formType ? formType : 'Consumables' // add error handling
    useTitle(`Cost Tracking: New ${form_Type}`)
    const [getActivity, { data: res, isSuccess, isError, error }] = useLazyGetActivityByTypeQuery();
    const records = {
        "_id": "new",
        "employeeId": null,
        "type": null,
        "details": null,
        "job": null,
        "terminal": null,
        "activityId": '',
        "userId": null,
        "amount": 0,
        "amtType": null,
        "dateTime": Date.now(),
        "description": null,
        "fileInfo": [],
        "formId": null,
        "posted": false,
        "unit": null
    }
    useEffect(() => {
        getActivity(form_Type)
    }, [])

    if (isError) {
        console.log(`FrmRecord loading error: ${error}`)
    }

    if (isSuccess) {
        const newRes = {}
        newRes.records = records
        newRes.formType = formType
        newRes.activities = res.activities
        if (formType === 'Consumables') {
            !res.consumables ? window.location.reload(false) : newRes.consumables = res.consumables
        } else if (formType === 'Equipment') {
            !res.equipment ? window.location.reload(false) : newRes.equipment = res.equipment
        } else if (formType === 'Expenses') {
            !res.expenses ? window.location.reload(false) : newRes.expenses = res.expenses
        }

        return (<FrmRecordForm res={newRes} />)

    }

}
export default FrmRecord