import EditConsumableForm from './EditConsumableForm'
import { useGetConsumablesQuery } from './consumablesApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../../hooks/useTitle'

const EditConsumable = () => {
    useTitle('Cost Tracking: Consumable')


    const {
        data: res,
        isLoading,
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

        if (!res.consumables || !res.consumables?.length) return <PulseLoader color={"#FFF"} />



        content = <EditConsumableForm consumable={res.consumables} />

        return content
    }
}
export default EditConsumable