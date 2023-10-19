import { useGetConsumablesQuery } from './consumablesApiSlice'
import EditConsumableForm from './EditConsumableForm'
import useTitle from '../../hooks/useTitle'

const EditConsumable = () => {
    useTitle('Cost Tracking: Consumable')
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
        content = <EditConsumableForm consumables={consumables} />
        return content
    }
    if (isError) {// no records found
        if (error.status === 400) {
            content = <EditConsumableForm consumables={consumables} />
            return content
        } else {
            console.log(`error loading data: ${error}`)
        }
    }
}
export default EditConsumable