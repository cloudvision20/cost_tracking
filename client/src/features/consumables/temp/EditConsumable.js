import { useParams } from 'react-router-dom'
import EditConsumableForm from './EditConsumableForm'
import { useGetConsumableByIdQuery } from './consumablesApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'

const EditConsumable = () => {
    useTitle('Cost Tracking: Consumable')

    const { id } = useParams()

    // const { consumable } = useGetConsumablesQuery("consumablesList", {
    //     selectFromResult: ({ data }) => ({
    //         consumable: data?.entities[id]
    //     }),
    // })




    const { userid, username, isManager, isAdmin } = useAuth()

    const { data: res, isSuccess } = useGetConsumableByIdQuery(id);

    let content

    if (isSuccess) {

        if (!res.consumable || !res.activities?.length) return <PulseLoader color={"#FFF"} />

        if (!isManager && !isAdmin) {
            if (res.consumable.userId.username !== username) {
                return <p className="errmsg">No access</p>
            }
        }
        //     content = <EditActivityForm dailyReports={res.dailyReports} projects={res.projects} activity={res.activity[0]} users={res.users} />


        // if (!consumable) return <PulseLoader color={"#FFF"} />

        content = <EditConsumableForm consumable={res.consumable[0]} />

        return content
    }
}
export default EditConsumable