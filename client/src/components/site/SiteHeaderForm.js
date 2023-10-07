import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation, NavLink } from 'react-router-dom'
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const SiteHeader = () => {

    const [currentActivity, setCurrentActivity] = useState('')
    const onMouseOverNavLink = (e) => { e.target.style.color = 'rgba(110, 110, 110, 0.9)' }
    const onMouseOutNavLink_Whitesmoke = (e) => { e.target.style.color = 'whitesmoke' }
    const onMouseOutNavLink_Blue = (e) => { e.target.style.color = 'blue' }
    const navLinkStyle_Whitesmoke = { color: 'whitesmoke', fontSize: '14px' }
    const navLinkStyle_blue = { color: 'blue', fontSize: '14px' }
    const activities = useSelector(selectActivity)
    const onActivitiesSelected = (activityId) => setCurrentActivity(activityId)
    let navDropdownItems
    if (activities) {

        navDropdownItems = activities.map(activity => {
            return (
                <NavDropdown.Item href="#activity._id"
                    onMouseOver={onMouseOverNavLink}
                    onMouseOut={onMouseOutNavLink_Blue}
                    onClick={onActivitiesSelected(activity._id)}
                    style={navLinkStyle_blue}
                >
                    {activity.name}
                </NavDropdown.Item>
            )
        });
    }


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

    const onConsumablesClicked = () => navigate('/site/consumables')
    const onNewConsumableClicked = () => navigate('/site/Consumables/new')
    const onFilesClicked = () => navigate('/site/files')
    const onAttendancesClicked = () => navigate('/site/files/attendances')
    const onGpsdatsClicked = () => navigate('/site/files/gpsdats')




    let consumablesNavLink = null
    consumablesNavLink = (
        <Nav.Link
            onClick={onConsumablesClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            href='#'>
            Consumables
        </Nav.Link>
    )
    let newConsumableNavLink = null
    newConsumableNavLink = (
        <Nav.Link
            onClick={onNewConsumableClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            href='#'>
            New_Consumable
        </Nav.Link>
    )


    let filesNavLink = null
    filesNavLink = (
        <Nav.Link
            onClick={onFilesClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            href='#'>
            Files
        </Nav.Link>
    )

    let attendancesNavLink = null
    attendancesNavLink = (
        <Nav.Link
            onClick={onAttendancesClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            href='#'>
            Attendances
        </Nav.Link>
    )

    let gpsdatsNavLink = null
    gpsdatsNavLink = (
        <Nav.Link
            onClick={onGpsdatsClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            href='#'>
            GPS_Data
        </Nav.Link>
    )

    const logoutNavLink = (
        <Nav.Link
            onClick={sendLogout}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            href='#'>
            Logout
        </Nav.Link>
    )

    const backNavLink = (
        <Nav.Link
            onClick={() => navigate(-1)}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            href='#'>
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
                {newConsumableNavLink}
                {consumablesNavLink}
                {filesNavLink}
                {logoutNavLink}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="site-header">
                <div className={`container-xl site-header__container`}>
                    <Navbar expand="lg" dark style={{ backgroundColor: '#212f51' }} >

                        <Container>
                            <Navbar.Brand href="/site"
                                style={navLinkStyle_Whitesmoke} >
                                <div>
                                    <span style={{ fontSize: '20px' }}> <b>Cost Tracking</b></span>
                                    <span style={{ fontSize: '14px' }}> --- {pathname}</span>
                                </div>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            {/* </Container>
                        <Container> */}
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    {navLinkContent}
                                    <NavDropdown title={< span style={navLinkStyle_Whitesmoke} >Activities</span>} id="basic-nav-dropdown">

                                        {navDropdownItems}
                                        {/* <NavDropdown.Item href="#action/3.1"
                                            onMouseOver={onMouseOverNavLink}
                                            onMouseOut={onMouseOutNavLink_Blue}
                                            style={navLinkStyle_blue}
                                        >Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2"
                                            onMouseOver={onMouseOverNavLink}
                                            onMouseOut={onMouseOutNavLink_Blue}
                                            style={navLinkStyle_blue}
                                        >
                                            Another action
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3"
                                            onMouseOver={onMouseOverNavLink}
                                            onMouseOut={onMouseOutNavLink_Blue}
                                            style={navLinkStyle_blue}
                                        >Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4"
                                            onMouseOver={onMouseOverNavLink}
                                            onMouseOut={onMouseOutNavLink_Blue}
                                            style={navLinkStyle_blue}
                                        >
                                            Separated link
                                        </NavDropdown.Item> */}
                                    </NavDropdown>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
            </header>
        </>
    )
    return content
}
export default SiteHeader