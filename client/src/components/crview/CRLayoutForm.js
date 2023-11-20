// import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import CRHeader from './CRHeader'
import CRFooter from './CRFooter'
// import { setActivity } from './crSlice'
// import { useDispatch } from 'react-redux'
// import useAuth from '../../hooks/useAuth'
// import { useGetActivitiesByUserIdQuery } from '../../features/activities/activitiesApiSlice'

const CRLayout = () => {
    // const dispatch = useDispatch()
    // const { userid } = useAuth()
    // const { data: activities, isSuccess } = useGetActivitiesByUserIdQuery(userid);

    // if (isSuccess) {
    //     try {
    //         dispatch(setActivity({ activities }))
    //     } catch (err) {
    //         console.log(`cRLayout dispatch error: ${err}`)
    //     } finally {
    return (
        <>
            <CRHeader />
            <div className="container-xl ct-container">
                <Outlet />
            </div>
            <CRFooter />
        </>
    )
    //     }
    // }
}
export default CRLayout