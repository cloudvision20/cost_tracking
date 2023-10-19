import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons" //, faFileInvoiceDollar, faClipboard, faClipboardList, faRectangleList, faFileCirclePlus, faFilePen, faUserGear, faUserPlus, faRightFromBracket, faTable 
import { useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const DASH_REGEX = /^\/dash(\/)?$/
const DAILY_REPORTS_REGEX = /^\/dash\/dailyReports(\/)?$/
const ACTIVITIES_REGEX = /^\/dash\/activities(\/)?$/
const PROJECTS_REGEX = /^\/dash\/projects(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
//const btnStyle = { padding: "3px", height: "90%", fontSize: "14px" }

const DashHeader = () => {

    const { isManager, isAdmin } = useAuth()
    const onMouseOverNavLink = (e) => { e.target.style.color = 'rgba(110, 110, 110, 0.9)' }
    const onMouseOutNavLink_Whitesmoke = (e) => { e.target.style.color = 'whitesmoke' }
    //const onMouseOutNavLink_Blue = (e) => { e.target.style.color = 'blue' }
    const navLinkStyle_Whitesmoke = { color: 'whitesmoke', fontSize: '14px' }
    //const navLinkStyle_blue = { color: 'blue', fontSize: '14px' }
    const navLnkStyle_Btn = "btn btn-light"

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

    const onNewDailyReportClicked = () => navigate('/dash/dailyReports/new')
    const onDailyReportsClicked = () => navigate('/dash/dailyReports')

    const onNewActivityClicked = () => navigate('/dash/activities/new')
    const onActivitiesClicked = () => navigate('/dash/activities')

    const onNewProjectClicked = () => navigate('/dash/projects/new')
    const onProjectsClicked = () => navigate('/dash/projects')

    const onNewUserClicked = () => navigate('/dash/users/new')
    const onUsersClicked = () => navigate('/dash/users')


    // let dashClass = null
    // if (!DASH_REGEX.test(pathname) && !DAILY_REPORTS_REGEX.test(pathname)
    //     && !ACTIVITIES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)
    //     && !PROJECTS_REGEX.test(pathname)) {
    //     dashClass = "ct-header__container--small"
    // }

    let newDailyReportNavLink = null
    if (DAILY_REPORTS_REGEX.test(pathname)) {
        newDailyReportNavLink = (
            <Nav.Link
                className={navLnkStyle_Btn}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Whitesmoke}
                style={navLinkStyle_Whitesmoke}
                title="New Daily Report"
                onClick={onNewDailyReportClicked}
            >
                {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
                New Daily Report
            </Nav.Link>
        )
    }

    let dailyReportsNavLink = null
    if (DASH_REGEX.test(pathname)) {
        //if (!DAILY_REPORTS_REGEX.test(pathname) && pathname.includes('/dash')) {
        dailyReportsNavLink = (
            <Nav.Link
                className={navLnkStyle_Btn}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Whitesmoke}
                style={navLinkStyle_Whitesmoke}
                title="Daily Reports"
                onClick={onDailyReportsClicked}
            >
                {/* <FontAwesomeIcon icon={faClipboardList} /> */}
                Daily Reports
            </Nav.Link>
        )
    }

    let newActivityNavLink = null
    if (ACTIVITIES_REGEX.test(pathname)) {
        newActivityNavLink = (
            <Nav.Link
                className={navLnkStyle_Btn}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Whitesmoke}
                style={navLinkStyle_Whitesmoke}
                title="New Activity"
                onClick={onNewActivityClicked}
            >
                {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
                New Activity
            </Nav.Link>
        )
    }

    let activitiesNavLink = null
    if (DASH_REGEX.test(pathname)) {
        //if (!ACTIVITIES_REGEX.test(pathname) && pathname.includes('/dash')) {
        activitiesNavLink = (
            <Nav.Link
                className={navLnkStyle_Btn}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Whitesmoke}
                style={navLinkStyle_Whitesmoke}
                title="Activities"
                onClick={onActivitiesClicked}
            >
                {/* <FontAwesomeIcon icon={faRectangleList} /> */}
                Activities
            </Nav.Link>
        )
    }


    let newProjectNavLink = null
    if (PROJECTS_REGEX.test(pathname)) {
        newProjectNavLink = (
            <Nav.Link
                className={navLnkStyle_Btn}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Whitesmoke}
                style={navLinkStyle_Whitesmoke}
                title="New Project"
                onClick={onNewProjectClicked}
            >
                {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
                New Project
            </Nav.Link>
        )
    }

    let projectsNavLink = null
    if (isManager || isAdmin) {
        if (DASH_REGEX.test(pathname)) {
            //if (!PROJECTS_REGEX.test(pathname) && pathname.includes('/dash')) {
            projectsNavLink = (
                <Nav.Link
                    className={navLnkStyle_Btn}
                    onMouseOver={onMouseOverNavLink}
                    onMouseOut={onMouseOutNavLink_Whitesmoke}
                    style={navLinkStyle_Whitesmoke}
                    title="Projects"
                    onClick={onProjectsClicked}
                >
                    {/* <FontAwesomeIcon icon={faFileInvoiceDollar} /> */}
                    Projects
                </Nav.Link>
            )
        }
    }


    let newUserNavLink = null
    if (USERS_REGEX.test(pathname)) {
        newUserNavLink = (
            <Nav.Link
                className={navLnkStyle_Btn}
                onMouseOver={onMouseOverNavLink}
                onMouseOut={onMouseOutNavLink_Whitesmoke}
                style={navLinkStyle_Whitesmoke}
                title="New User"
                onClick={onNewUserClicked}
            >
                {/* <FontAwesomeIcon icon={faUserPlus} /> */}
                New User
            </Nav.Link>
        )
    }

    let usersNavLink = null
    if (isManager || isAdmin) {
        if (DASH_REGEX.test(pathname)) {
            //if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            usersNavLink = (
                <Nav.Link
                    className={navLnkStyle_Btn}
                    onMouseOver={onMouseOverNavLink}
                    onMouseOut={onMouseOutNavLink_Whitesmoke}
                    style={navLinkStyle_Whitesmoke}
                    title="Users"
                    onClick={onUsersClicked}
                >
                    {/* <FontAwesomeIcon icon={faUserGear} /> */}
                    Users
                </Nav.Link>
            )
        }
    }

    const logoutNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Logout"
            onClick={sendLogout}
        >
            {/* <FontAwesomeIcon icon={faRightFromBracket} /> */}
            Logout
        </Nav.Link>
    )

    const backNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Back"
            onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowCircleLeft} />
        </Nav.Link>
    )

    const blankNavLink = (
        <Nav.Link
            disabled="true"
            title="Blank"
        >&nbsp;&#9;&#9;&nbsp;
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
                {newProjectNavLink}
                {projectsNavLink}
                {newActivityNavLink}
                {activitiesNavLink}
                {newDailyReportNavLink}
                {dailyReportsNavLink}
                {newUserNavLink}
                {usersNavLink}

            </>
        )
    }

    const content = (

        <>
            <p className={errClass}>{error?.data?.message}</p>
            <div className="ct-header">
                <div className="container-xl  ct-header__container">
                    <Navbar expand="lg" style={{ backgroundColor: '#212f51' }} >
                        <Navbar.Brand href="/dash" style={navLinkStyle_Whitesmoke} >
                            <div>
                                <span style={{ fontSize: '20px' }}> <b>Cost Tracking Maintenance</b></span>
                                <span style={{ fontSize: '14px' }}> --- {pathname}</span>
                            </div>
                        </Navbar.Brand>
                    </Navbar>
                    <Navbar bg="backgroundColor: #212f51"  >
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                {navLinkContent}
                                {blankNavLink}
                                {blankNavLink}
                                {logoutNavLink}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </>
    )

    return content
}
export default DashHeader