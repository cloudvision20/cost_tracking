import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faFileInvoiceDollar, faClipboard, faClipboardList, faRectangleList, faFileCirclePlus, faFilePen, faUserGear, faUserPlus, faRightFromBracket, faTable } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

const DASH_REGEX = /^\/dash(\/)?$/
const DAILY_REPORTS_REGEX = /^\/dash\/dailyReports(\/)?$/
const ACTIVITIES_REGEX = /^\/dash\/activities(\/)?$/
const PROJECTS_REGEX = /^\/dash\/projects(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const btnStyle = { padding: "3px", height: "90%", fontSize: "14px" }

const DashHeader = () => {
    const { isManager, isAdmin } = useAuth()

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


    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !DAILY_REPORTS_REGEX.test(pathname)
        && !ACTIVITIES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)
        && !PROJECTS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    let newDailyReportButton = null
    if (DAILY_REPORTS_REGEX.test(pathname)) {
        newDailyReportButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="New Daily Report"
                onClick={onNewDailyReportClicked}
            >
                {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
                New Daily Report
            </button>
        )
    }

    let dailyReportsButton = null
    if (DASH_REGEX.test(pathname)) {
        //if (!DAILY_REPORTS_REGEX.test(pathname) && pathname.includes('/dash')) {
        dailyReportsButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="DailyReports"
                onClick={onDailyReportsClicked}
            >
                {/* <FontAwesomeIcon icon={faClipboardList} /> */}
                Daily Reports
            </button>
        )
    }

    let newActivityButton = null
    if (ACTIVITIES_REGEX.test(pathname)) {
        newActivityButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="New Activity"
                onClick={onNewActivityClicked}
            >
                {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
                New Activity
            </button>
        )
    }

    let activitiesButton = null
    if (DASH_REGEX.test(pathname)) {
        //if (!ACTIVITIES_REGEX.test(pathname) && pathname.includes('/dash')) {
        activitiesButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="Activities"
                onClick={onActivitiesClicked}
            >
                {/* <FontAwesomeIcon icon={faRectangleList} /> */}
                Activities
            </button>
        )
    }


    let newProjectButton = null
    if (PROJECTS_REGEX.test(pathname)) {
        newProjectButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="New Project"
                onClick={onNewProjectClicked}
            >
                {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
                New Project
            </button>
        )
    }

    let projectsButton = null
    if (isManager || isAdmin) {
        if (DASH_REGEX.test(pathname)) {
            //if (!PROJECTS_REGEX.test(pathname) && pathname.includes('/dash')) {
            projectsButton = (
                <button
                    className="btn btn-primary"
                    style={btnStyle}
                    title="Projects"
                    onClick={onProjectsClicked}
                >
                    {/* <FontAwesomeIcon icon={faFileInvoiceDollar} /> */}
                    Projects
                </button>
            )
        }
    }


    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="New User"
                onClick={onNewUserClicked}
            >
                {/* <FontAwesomeIcon icon={faUserPlus} /> */}
                New User
            </button>
        )
    }

    let usersButton = null
    if (isManager || isAdmin) {
        if (DASH_REGEX.test(pathname)) {
            //if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            usersButton = (
                <button
                    className="btn btn-primary"
                    style={btnStyle}
                    title="Users"
                    onClick={onUsersClicked}
                >
                    {/* <FontAwesomeIcon icon={faUserGear} /> */}
                    Users
                </button>
            )
        }
    }

    const logoutButton = (
        <button
            className="btn btn-primary"
            style={btnStyle}
            title="Logout"
            onClick={sendLogout}
        >
            {/* <FontAwesomeIcon icon={faRightFromBracket} /> */}
            Logout
        </button>
    )

    const backButton = (
        <button
            className="btn btn-primary"
            style={btnStyle}
            title="Back"
            onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowCircleLeft} />
        </button>
    )
    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {
        buttonContent = <PulseLoader color={"#FFF"} />
    } else {
        buttonContent = (
            <>
                {backButton}
                {newProjectButton}
                {projectsButton}
                {newActivityButton}
                {activitiesButton}
                {newDailyReportButton}
                {dailyReportsButton}
                {newUserButton}
                {usersButton}
                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`container-xl dash-header__container`}>
                    <Link style={{ color: 'whitesmoke', textDecoration: 'none' }} to="/dash">
                        <div><span style={{ fontSize: '20px' }}> <b>Cost Tracking</b></span> <span >--- {pathname}</span>
                        </div>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default DashHeader