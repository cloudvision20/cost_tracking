import { useGetEquipmentQuery } from './equipmentApiSlice'
import { useParams } from 'react-router-dom'
import EditEquipmentForm from './EditEquipmentForm'

import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'

const EditEquipment = () => {
    useTitle('Cost Tracking: Equipment')



    const {
        data: equipment,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetEquipmentQuery('equipmentList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })


    let content

    if (isSuccess) {

        if (!equipment) return <PulseLoader color={"#FFF"} />

        content = <EditEquipmentForm equipment={equipment} />

        return content
    }
}
export default EditEquipment