import { useEffect } from 'react'
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
    const { userid } = useAuth()
    const { data: activities, isSuccess } = useGetActivitiesByUserIdQuery(userid);

    useEffect(() => {
        dispatch(setActivity({ activities }))
    }, [isSuccess])

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