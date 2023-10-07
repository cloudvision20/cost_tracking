import SiteHeaderForm from './SiteHeaderForm'
import useTitle from "../../hooks/useTitle"
import { useGetActivitiesByUserIdQuery } from './../../features/activities/activitiesApiSlice'
import useAuth from "../../hooks/useAuth"
//import useActvitiesByUser from '../../hooks/useActvitiesByUser'

const SiteHeader = () => {
    useTitle('Site Page')

    const { userid, username, status, isManager, isAdmin } = useAuth()
    const { data: res, isSuccess } = useGetActivitiesByUserIdQuery(userid);
    //const { activities } = useActvitiesByUser(userid)

    let content

    // if (isSuccess) {

    content = <SiteHeaderForm isManager={isManager} isAdmin={isAdmin} userid={userid} username={username} status={status} activities={res[0]} />

    // }


    return content
}
export default SiteHeader