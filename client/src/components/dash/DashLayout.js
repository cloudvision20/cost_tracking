import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className="container-xl ct-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}
export default DashLayout