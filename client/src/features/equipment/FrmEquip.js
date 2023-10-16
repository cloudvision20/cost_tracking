import { useGetEquipmentQuery } from './equipmentApiSlice'
import FrmEquipForm from './FrmEquipForm'
import useTitle from '../../hooks/useTitle'

const FrmEquip = () => {
    useTitle('Cost Tracking: Equip')
    const {
        data: equipment,
        //isLoading,
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
        content = <FrmEquipForm equipment={equipment} />
        return content
    }
    if (isError) {
        if (error.status === 400) {
            content = <FrmEquipForm equipment={equipment} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmEquip