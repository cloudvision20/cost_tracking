import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

const SITE_REGEX = /^\/site(\/)?$/
const FILES_REGEX = /^\/site\/files\/dailyReports(\/)?$/

const DAILY_REPORTS_REGEX = /^\/site\/dailyReports(\/)?$/

const CONSUMABLES_REGEX = /^\/site\/consumables(\/)?$/
const GPSDATS_REGEX = /^\/site\/files\/gpsdats(\/)?$/
//const USERS_REGEX = /^\/site\/users(\/)?$/

const SiteHeader = () => {
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
                title="Gps data"
                onClick={onGpsdatsClicked}
            >
                {/* <FontAwesomeIcon icon={faRectangleList} /> */}
                GPS Data
            </button>
        )
    }


    // let newProjectButton = null
    // if (PROJECTS_REGEX.test(pathname)) {
    //     newProjectButton = (
    //         <button
    //             className="btn btn-primary"
    //             title="New Project"
    //             onClick={onNewProjectClicked}
    //         >
    //             {/* <FontAwesomeIcon icon={faFileCirclePlus} /> */}
    //             New Project
    //         </button>
    //     )
    // }

    // let projectsButton = null
    // if (isManager || isAdmin) {
    //     if (SITE_REGEX.test(pathname)) {
    //         //if (!PROJECTS_REGEX.test(pathname) && pathname.includes('/site')) {
    //         projectsButton = (
    //             <button
    //                 className="btn btn-primary"
    //                 title="Projects"
    //                 onClick={onProjectsClicked}
    //             >
    //                 {/* <FontAwesomeIcon icon={faFileInvoiceDollar} /> */}
    //                 Projects
    //             </button>
    //         )
    //     }
    // }


    // let newUserButton = null
    // if (USERS_REGEX.test(pathname)) {
    //     newUserButton = (
    //         <button
    //             className="btn btn-primary"
    //             title="New User"
    //             onClick={onNewUserClicked}
    //         >
    //             {/* <FontAwesomeIcon icon={faUserPlus} /> */}
    //             New User
    //         </button>
    //     )
    // }

    // let usersButton = null
    // if (isManager || isAdmin) {
    //     if (SITE_REGEX.test(pathname)) {
    //         //if (!USERS_REGEX.test(pathname) && pathname.includes('/site')) {
    //         usersButton = (
    //             <button
    //                 className="btn btn-primary"
    //                 title="Users"
    //                 onClick={onUsersClicked}
    //             >
    //                 {/* <FontAwesomeIcon icon={faUserGear} /> */}
    //                 Users
    //             </button>
    //         )
    //     }
    // }

    const logoutButton = (
        <button
            className="btn btn-primary"
            title="Logout"
            onClick={sendLogout}
        >
            {/* <FontAwesomeIcon icon={faRightFromBracket} /> */}
            Logout
        </button>
    )

    // const bstableButton = (
    //     <button
    //         className="btn btn-primary"
    //         title="BSTable"
    //         onClick={() => navigate('/site/bstable')}>
    //         {/* <FontAwesomeIcon icon={faTable} /> */}
    //         BSTable testing
    //     </button>
    // )
    const backButton = (
        <button
            className="btn btn-primary"
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
                        <span style={{ fontSize: '18px' }}>Cost Tracking </span> <span >--- {pathname}</span>
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