import { useGetTypesQuery } from './typesApiSlice'
import FrmTypesForm from './FrmTypesForm'
import useTitle from '../../hooks/useTitle'


const FrmTypes = () => {
    useTitle(`Cost Tracking: Edit Types`)
    const { data: res, isSuccess, isError, error } = useGetTypesQuery();
    let content
    if (isSuccess) {

        content = <FrmTypesForm types={res} />
        return content
    }
    if (isError) {// no records found
        if (error.status === 400) {
            const newTypes = { "category": null, "name": null, "_id": null, "remarks": null }
            content = <FrmTypesForm types={newTypes} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmTypes