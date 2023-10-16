import { useGetConsumablesQuery } from './consumablesApiSlice'
import FrmConsumableForm from './FrmConsumableForm'
import useTitle from '../../hooks/useTitle'

const FrmConsumable = () => {
    useTitle('Cost Tracking: Consumable Record')
    const {
        data: consumables,
        //isLoading,
        isSuccess,
        isError,
        error
    } = useGetConsumablesQuery('consumablesList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content
    if (isSuccess) {
        content = <FrmConsumableForm consumables={consumables} />
        return content
    }
    if (isError) {
        if (error.status === 400) {
            content = <FrmConsumableForm consumables={consumables} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default FrmConsumable