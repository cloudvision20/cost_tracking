import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { setActivity } from './siteSlice'
import { useDispatch } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import { useGetActivitiesByUserIdQuery } from '../../features/activities/activitiesApiSlice'

const SiteLayout = () => {
    const dispatch = useDispatch()
    const { userid } = useAuth()
    const { data: activities, isSuccess } = useGetActivitiesByUserIdQuery(userid);

    if (isSuccess) {
        try {
            dispatch(setActivity({ activities }))
        } catch (err) {
            console.log(`siteLayout dispatch error: ${err}`)
        }
        return (
            <>
                <SiteHeader />
                <div className="container-xl ct-container">
                    <Outlet />
                </div>
                <SiteFooter />
            </>
        )
    }
}
export default SiteLayout