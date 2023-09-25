import { Outlet } from 'react-router-dom'
import DashHeader from './SiteHeader'
import DashFooter from './SiteFooter'

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className="container-xl dash-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}
export default DashLayout