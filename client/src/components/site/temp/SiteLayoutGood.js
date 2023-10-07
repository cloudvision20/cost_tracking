import { Outlet } from 'react-router-dom'
import SiteHeader from '../SiteHeader'
import SiteFooter from '../SiteFooter'

const SiteLayout = () => {

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