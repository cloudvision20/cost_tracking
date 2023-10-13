import { useGetConsumablesQuery } from "../consumablesApiSlice"
import Consumable from '../Consumable'
import useTitle from "../../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const ConsumablesList = () => {
    useTitle('Cost Tracking: Consumables List')

    const {
        data: consumables,
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

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = consumables

        const tableContent = ids?.length && ids.map(consumableId => <Consumable key={consumableId} consumableId={consumableId} />)

        content = (
            <table className="table table-striped table-hover" style={{ fontSize: '12px' }}>
                <thead className="">
                    <tr>
                        <th scope="col" className="">Name</th>
                        <th scope="col" className="">Type of Consumable</th>
                        <th scope="col" className="">Capacity</th>
                        <th scope="col" className="">Date and Time</th>
                        <th scope="col" className="">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default ConsumablesList