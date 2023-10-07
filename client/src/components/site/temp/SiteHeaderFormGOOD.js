import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../../../features/auth/authApiSlice'
//import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

const SITE_REGEX = /^\/site(\/)?$/
const FILES_REGEX = /^\/site\/files\/dailyReports(\/)?$/

const DAILY_REPORTS_REGEX = /^\/site\/dailyReports(\/)?$/

const CONSUMABLES_REGEX = /^\/site\/consumables(\/)?$/
const GPSDATS_REGEX = /^\/site\/files\/gpsdats(\/)?$/
//const USERS_REGEX = /^\/site\/users(\/)?$/
const btnStyle = { padding: "3px", height: "90%", fontSize: "14px" }

const SiteHeader = () => {
    // const { isManager, isAdmin } = useAuth()

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

    // const onNewUserClicked = () => navigate('/site/users/new')
    // const onUsersClicked = () => navigate('/site/users')


    let siteClass = null
    if (!SITE_REGEX.test(pathname) && !CONSUMABLES_REGEX.test(pathname)
        && !GPSDATS_REGEX.test(pathname)) {
        siteClass = "site-header__container--small"
    }

    let consumablesButton = null
    // if (CONSUMABLES_REGEX.test(pathname)) {
    consumablesButton = (
        <button
            className="btn btn-primary"
            style={btnStyle}
            title="Consumables"
            onClick={onConsumablesClicked}
        >
            {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
            Consumables
        </button>
    )
    // }

    let newConsumableButton = null
    // if (USERS_REGEX.test(pathname)) {
    newConsumableButton = (
        <button
            className="btn btn-primary"
            style={btnStyle}
            title="New Consumabler"
            onClick={onNewConsumableClicked}
        >
            {/* <FontAwesomeIcon icon={faUserPlus} /> */}
            New Consumable
        </button>
    )
    // }

    let filesButton = null
    // if (FILES_REGEX.test(pathname)) {
    //if (!CONSUMABLES_REGEX.test(pathname) && pathname.includes('/site')) {
    filesButton = (
        <button
            className="btn btn-primary"
            style={btnStyle}
            title="Files"
            onClick={onFilesClicked}
        >
            {/* <FontAwesomeIcon icon={faClipboardList} /> */}
            Files
        </button>
    )
    // }

    let attendancesButton = null
    if (GPSDATS_REGEX.test(pathname)) {
        attendancesButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="Attendances"
                onClick={onAttendancesClicked}
            >
                {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
                Attendances
            </button>
        )
    }

    let gpsdatsButton = null
    if (SITE_REGEX.test(pathname)) {
        //if (!GPSDATS_REGEX.test(pathname) && pathname.includes('/site')) {
        gpsdatsButton = (
            <button
                className="btn btn-primary"
                style={btnStyle}
                title="Gps data"
                onClick={onGpsdatsClicked}
            >
                {/* <FontAwesomeIcon icon={faRectangleList} /> */}
                GPS Data
            </button>
        )
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
                {attendancesButton}
                {gpsdatsButton}
                {newConsumableButton}
                {consumablesButton}
                {filesButton}

                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="site-header">
                <div className={`container-xl site-header__container`}>
                    {/* ${siteClass}`}> */}
                    <Link style={{ color: 'whitesmoke', textDecoration: 'none' }} to="/site">
                        <div><span style={{ fontSize: '20px' }}> <b>Cost Tracking</b></span> <span >--- {pathname}</span>
                            {/* <div>activity info</div> */}
                        </div>
                    </Link>
                    <nav className="site-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default SiteHeader