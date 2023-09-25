import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowCircleLeft,
    faFileInvoiceDollar,
    faClipboard,
    faClipboardList,
    faRectangleList,
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

const DASH_REGEX = /^\/dash(\/)?$/
const DAILY_REPORTS_REGEX = /^\/dash\/dailyReports(\/)?$/
const ACTIVITIES_REGEX = /^\/dash\/activities(\/)?$/
const PROJECTS_REGEX = /^\/dash\/projects(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

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
                title="New Daily Report"
                onClick={onNewDailyReportClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let dailyReportsButton = null
    if (DASH_REGEX.test(pathname)) {
        //if (!DAILY_REPORTS_REGEX.test(pathname) && pathname.includes('/dash')) {
        dailyReportsButton = (
            <button
                className="btn btn-primary"
                title="DailyReports"
                onClick={onDailyReportsClicked}
            >
                <FontAwesomeIcon icon={faClipboardList} />
            </button>
        )
    }

    let newActivityButton = null
    if (ACTIVITIES_REGEX.test(pathname)) {
        newActivityButton = (
            <button
                className="btn btn-primary"
                title="New Activity"
                onClick={onNewActivityClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let activitiesButton = null
    if (DASH_REGEX.test(pathname)) {
        //if (!ACTIVITIES_REGEX.test(pathname) && pathname.includes('/dash')) {
        activitiesButton = (
            <button
                className="btn btn-primary"
                title="Activities"
                onClick={onActivitiesClicked}
            >
                <FontAwesomeIcon icon={faRectangleList} />
            </button>
        )
    }


    let newProjectButton = null
    if (PROJECTS_REGEX.test(pathname)) {
        newProjectButton = (
            <button
                className="btn btn-primary"
                title="New Project"
                onClick={onNewProjectClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let projectButton = null
    if (isManager || isAdmin) {
        if (DASH_REGEX.test(pathname)) {
            //if (!PROJECTS_REGEX.test(pathname) && pathname.includes('/dash')) {
            projectButton = (
                <button
                    className="btn btn-primary"
                    title="Projects"
                    onClick={onProjectsClicked}
                >
                    <FontAwesomeIcon icon={faFileInvoiceDollar} />
                </button>
            )
        }
    }


    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="btn btn-primary"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let userButton = null
    if (isManager || isAdmin) {
        if (DASH_REGEX.test(pathname)) {
            //if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    className="btn btn-primary"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    const logoutButton = (
        <button
            className="btn btn-primary"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {
        buttonContent = <PulseLoader color={"#FFF"} />
    } else {
        buttonContent = (
            <>

                {newProjectButton}
                {projectButton}
                {newActivityButton}
                {activitiesButton}
                {newDailyReportButton}
                {dailyReportsButton}
                {newUserButton}
                {userButton}

                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container`}>
                    {/* ${dashClass}`}> */}
                    <Link style={{ color: 'whitesmoke', textDecoration: 'none' }} to="/dash">
                        <h1 >Cost Tracking --- {pathname}</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Back"
                            onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faArrowCircleLeft} /></button>
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default DashHeader