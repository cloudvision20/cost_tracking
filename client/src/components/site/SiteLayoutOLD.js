import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import useAuth from "../../hooks/useAuth"
//import useActvitiesByUser from '../../hooks/useActvitiesByUser'
import ActivitiesContext from '../../context/ActivitiesContext'
import { useGetActivitiesByUserIdQuery } from '../../features/activities/activitiesApiSlice' //'../features/activities/activitiesApiSlice'


const SiteLayout = () => {

    const { userid, username, status } = useAuth()
    const { data: res, isSuccess } = useGetActivitiesByUserIdQuery(userid);
    // const [getActivitiesByUserId, { isSuccess }] = useGetActivitiesByUserIdQuery();
    //const { activities } = await getActivitiesByUserId(userid).unwrap();
    //const { activities } = useActvitiesByUser(userid)

    return (
        <>
            <ActivitiesContext.Provider value={{ activities: res }} >
                <SiteHeader />
                <div className="container-xl site-container">
                    <Outlet />
                </div>
                <SiteFooter />
            </ActivitiesContext.Provider>
        </>
    )
}
export default SiteLayout