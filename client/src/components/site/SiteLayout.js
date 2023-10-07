import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { setActivity } from './siteSlice'
import { useDispatch } from 'react-redux'
//import useActvitiesByUser from '../../hooks/useActvitiesByUser'
import useAuth from '../../hooks/useAuth'
import { useGetActivitiesByUserIdQuery } from '../../features/activities/activitiesApiSlice'

const SiteLayout = () => {
    const dispatch = useDispatch()
    const { userid, username, status, isManager, isAdmin } = useAuth()
    const { data: res, isSuccess } = useGetActivitiesByUserIdQuery(userid);
    //const { activities } = useActvitiesByUser(userid)
    if (isSuccess) {
        dispatch(setActivity({ activities: res }))
    }
    return (
        <>
            <SiteHeader />
            <div className="container-xl site-container">
                <Outlet />
            </div>
            <SiteFooter />
        </>
    )
}
export default SiteLayout