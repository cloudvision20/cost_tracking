import { useEffect } from "react"
import { useLazyGetAllMastersByTypeQuery } from "../masters/mastersApiSlice"
import FrmRecordForm from './FrmRecordForm'
import useTitle from '../../hooks/useTitle'
const FrmRecord = ({ formType }) => {

    const form_Type = formType ? formType : 'Consumables' // add error handling
    useTitle(`Cost Tracking: New ${form_Type}`)
    const [getMasters, { data: res, isSuccess, isError, error }] = useLazyGetAllMastersByTypeQuery();
    useEffect(() => {
        getMasters(form_Type)
    }, [])
    if (isError) {
        console.log(`FrmRecord loading error: ${error}`)
    }

    if (isSuccess) {
        return (<FrmRecordForm res={res} formType={form_Type} />)
    }

}
export default FrmRecord