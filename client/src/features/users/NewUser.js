// import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const NewUser = () => {
    useTitle('Cost Tracking: Edit User')

    const user = {
        "username": null,
        "employeeId": null,
        "employeeName": null,
        "contactInfo": null,
        "roles": [
            "Employee",
            "Site"
        ],
        "active": true
    }


    const content = <EditUserForm user={user} />

    return content
}
export default NewUser