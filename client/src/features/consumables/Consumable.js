import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetConsumablesQuery } from './consumablesApiSlice'
import { memo } from 'react'

const Consumable = ({ consumableId }) => {

    const { consumable } = useGetConsumablesQuery("consumablesList", {
        selectFromResult: ({ data }) => ({
            consumable: data?.entities[consumableId]
        }),
    })

    const navigate = useNavigate()

    if (consumable) {
        const handleEdit = () => navigate(`/dash/consumables/${consumableId}`)

        //const consumableRolesString = consumable.roles.toString().replaceAll(',', ', ')

        //const cellStatus = consumable.active ? '' : 'table__cell--inactive'

        return (
            <tr className="">
                <td className="">{consumable.userId.employeeName}</td>
                <td className="">{consumable.details}</td>
                <td className="">{consumable.type}</td>
                <td className="">{consumable.unit}</td>
                <td className="">{consumable.amount}</td>
                <td className="">{consumable.updatedAt}</td>
                <td className="">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedConsumable = memo(Consumable)

export default memoizedConsumable