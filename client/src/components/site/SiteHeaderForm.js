import { useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const SiteHeaderForm = () => {
    // const [curActivityId, setCurActivityId] = useState('')
    const onMouseOverNavLink = (e) => { e.target.style.color = 'rgba(110, 110, 110, 0.9)' }
    const onMouseOutNavLink_Whitesmoke = (e) => { e.target.style.color = 'whitesmoke' }
    const onMouseOutNavLink_Blue = (e) => { e.target.style.color = 'blue' }
    const navLinkStyle_Whitesmoke = { color: 'whitesmoke', fontSize: '14px' }
    const navLinkStyle_ws = { color: 'whitesmoke', fontSize: '14px', backgroundColor: '#212f51' }
    const navLnkStyle_Btn = "btn btn-light"
    const activities = useSelector(selectActivity)
    const onActivitiesSelected = (activityId) => { console.log(activityId) }

    let navActivitiesMenu
    if (activities) {

        navActivitiesMenu = activities.map(activity => {
            return (
                <NavDropdown.Item href="#activity._id"

                    key={activity._id}
                    onMouseOver={onMouseOverNavLink}
                    onMouseOut={onMouseOutNavLink_Blue}
                    onClick={() => onActivitiesSelected(activity._id)}
                    style={navLinkStyle_ws}
                >
                    {activity.name}
                </NavDropdown.Item>
            )
        });
    }
    const masters = [
        { '_id': 'Consumables', 'name': 'Consumables' },
        { '_id': 'Equipment', 'name': 'Equipment' },
        { '_id': 'Expenses', 'name': 'Expenses' }]
    let navMasterMenu

    navMasterMenu = masters.map(item => {
        return (
            <NavDropdown.Item href="#Masters"

                key={item._id}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Blue}
                onClick={() => onMastersSelected(item._id)}
                style={navLinkStyle_ws}
            >
                {item.name}
            </NavDropdown.Item>
        )
    })
    const forms = [
        { '_id': 'Consumables', 'name': 'Consumables form' },
        { '_id': 'Equipment', 'name': 'Equipment form' },
        { '_id': 'Expenses', 'name': 'Expenses form' }]
    let navFormsMenu
    navFormsMenu = forms.map(item => {
        return (
            <NavDropdown.Item href="#Master#Forms"

                key={item._id}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Blue}
                onClick={() => onFormsSelected(item._id)}
                style={navLinkStyle_ws}
            >
                {item.name}
            </NavDropdown.Item>
        )
    })
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    // const onConsumablesClicked = (e) => { navigate('/site/consumables') }
    // const onEquipmentClicked = () => navigate('/site/equipment')
    const onFilesClicked = () => navigate('/site/files')
    const onAttendancesClicked = () => navigate('/site/files/attendances')
    const onGpsdatsClicked = () => navigate('/site/files/gpsdats')
    const onMastersSelected = (item) => {
        switch (item) {
            case 'Consumables':
                navigate('/site/consumables')
                break;
            case 'Equipment':
                navigate('/site/equipment')
                break;
            case 'Expenses':
                navigate('/site/expenses')
                break;
            default:
                break;
        }
    }
    const onFormsSelected = (item) => {
        switch (item) {
            case 'Consumables':
                navigate('/site/forms/consumables')
                break;
            case 'Equipment':
                navigate('/site/forms/equipment')
                break;
            case 'Expenses':
                navigate('/site/forms/expenses')
                break;
            default:
                break;
        }
    }
    // let consumablesNavLink = null
    // consumablesNavLink = (
    //     <Nav.Link
    //         className={navLnkStyle_Btn}
    //         onClick={onConsumablesClicked}
    //         onMouseOver={onMouseOverNavLink}
    //         onMouseOut={onMouseOutNavLink_Whitesmoke}
    //         style={navLinkStyle_Whitesmoke}
    //         title="Consumables"
    //     >
    //         Consumables
    //     </Nav.Link>
    // )
    // let equipmentNavLink = null
    // equipmentNavLink = (
    //     <Nav.Link
    //         className={navLnkStyle_Btn}
    //         onClick={onEquipmentClicked}
    //         onMouseOver={onMouseOverNavLink}
    //         onMouseOut={onMouseOutNavLink_Whitesmoke}
    //         style={navLinkStyle_Whitesmoke}
    //         title="Equipment"
    //     >
    //         Equipment
    //     </Nav.Link>
    // )


    let filesNavLink = null
    filesNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={onFilesClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="File uploads"
        >
            Files
        </Nav.Link>
    )

    let attendancesNavLink = null
    attendancesNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={onAttendancesClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Attendance Files Upload"
        >
            Attendances
        </Nav.Link>
    )

    let gpsdatsNavLink = null
    gpsdatsNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={onGpsdatsClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Garmin GPS file upload"
        >
            GPS Data
        </Nav.Link>
    )

    const logoutNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={sendLogout}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Logoout"
        >
            Logout
        </Nav.Link>
    )

    const backNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={() => navigate(-1)}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Back"
        >
            <span className="sr-only">(current)</span>
            <FontAwesomeIcon icon={faArrowCircleLeft} />
        </Nav.Link>
    )
    const errClass = isError ? "errmsg" : "offscreen"

    let navLinkContent
    if (isLoading) {
        navLinkContent = <PulseLoader color={"#FFF"} />
    } else {
        navLinkContent = (
            <>
                {backNavLink}
                {attendancesNavLink}
                {gpsdatsNavLink}
                {/* {equipmentNavLink}
                {consumablesNavLink} */}
                {filesNavLink}
                {logoutNavLink}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <div className="site-header">
                <div className="container-xl  site-header__container">
                    <Navbar expand="lg" style={{ backgroundColor: '#212f51' }} >
                        <Navbar.Brand href="/site" style={navLinkStyle_Whitesmoke} >
                            <div>
                                <span style={{ fontSize: '20px' }}> <b>Cost Tracking Site</b></span>
                                <span style={{ fontSize: '14px' }}> --- {pathname}</span>
                            </div>
                        </Navbar.Brand>
                    </Navbar>
                    <Navbar style={{ backgroundColor: '#212f51' }} >
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" >
                            <Nav className="ms-auto" >
                                {navLinkContent}
                                <NavDropdown
                                    title={< span style={navLinkStyle_Whitesmoke}>Master Menu</span>}
                                    style={{ backgroundColor: '#212f51' }}
                                    onMouseOver={onMouseOverNavLink}
                                    onMouseOut={onMouseOutNavLink_Whitesmoke} id="basic-nav-dropdown">
                                    {navMasterMenu}
                                </NavDropdown>
                                <NavDropdown
                                    title={< span style={navLinkStyle_Whitesmoke}>Records Menu</span>}
                                    style={{ backgroundColor: '#212f51' }}
                                    onMouseOver={onMouseOverNavLink}
                                    onMouseOut={onMouseOutNavLink_Whitesmoke} id="basic-nav-dropdown">
                                    {navFormsMenu}
                                </NavDropdown>
                                <NavDropdown title={< span style={navLinkStyle_Whitesmoke}>Select Activity</span>}
                                    style={{ backgroundColor: '#212f51' }}
                                    onMouseOver={onMouseOverNavLink}
                                    onMouseOut={onMouseOutNavLink_Whitesmoke}
                                    id="basic-nav-dropdown">
                                    {navActivitiesMenu}
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </>
    )
    return content
}
export default SiteHeaderForm