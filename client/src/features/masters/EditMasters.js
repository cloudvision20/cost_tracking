import { useEffect } from "react"
import { useLazyGetAllMastersByTypeQuery } from './mastersApiSlice'
import EditMasterForm from './EditMastersForm'
import useTitle from '../../hooks/useTitle'

const EditMaster = ({ formType }) => {
    const form_Type = formType ? formType : 'Consumables' // add error handling
    useTitle(`Cost Tracking: Edit ${form_Type}`)
    const [getMasters, { data: res, isSuccess, isError, error }] = useLazyGetAllMastersByTypeQuery();
    useEffect(() => {
        getMasters(form_Type)
    }, [])
    let content
    if (isSuccess) {
        content = <EditMasterForm masters={res.masters} formType={formType} />
        return content
    }
    if (isError) {// no records found
        if (error.status === 400) {
            content = <EditMasterForm masters={res.masters} formType={formType} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default EditMaster