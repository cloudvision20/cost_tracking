import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../../../features/auth/authApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import NavDropdown from 'react-bootstrap/NavDropdown'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/js/bootstrap.bundle'
const SITE_REGEX = /^\/site(\/)?$/
const CONSUMABLES_REGEX = /^\/site\/consumables(\/)?$/
const GPSDATS_REGEX = /^\/site\/files\/gpsdats(\/)?$/

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

    let siteClass = null
    if (!SITE_REGEX.test(pathname) && !CONSUMABLES_REGEX.test(pathname)
        && !GPSDATS_REGEX.test(pathname)) {
        siteClass = "site-header__container--small"
    }

    let consumablesButton = null
    consumablesButton = (
        <li className="nav-item active">
            <a className="nav-link"
                onClick={onConsumablesClicked}
                onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                style={{ color: 'whitesmoke' }}
                href='#'>
                Consumables
            </a>
        </li>
    )
    let newConsumableButton = null
    newConsumableButton = (
        <li className="nav-item active">
            <a className="nav-link"
                onClick={onNewConsumableClicked}
                onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                style={{ color: 'whitesmoke' }}
                href='#'>
                New Consumable
            </a>
        </li>
    )


    let filesButton = null

    filesButton = (

        <li className="nav-item active">
            <a className="nav-link"
                onClick={onFilesClicked}
                onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                style={{ color: 'whitesmoke' }}
                href='#'>
                Files
            </a>
        </li>
    )

    let attendancesButton = null
    if (GPSDATS_REGEX.test(pathname)) {
        attendancesButton = (
            <li className="nav-item active">
                <a className="nav-link"
                    onClick={onAttendancesClicked}
                    onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                    onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                    style={{ color: 'whitesmoke' }}
                    href='#'>
                    Attendances
                </a>
            </li>
        )
    }

    let gpsdatsButton = null
    gpsdatsButton = (
        <li className="nav-item active">
            <a className="nav-link"
                onClick={onGpsdatsClicked}
                onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                style={{ color: 'whitesmoke' }}
                href='#'>
                GPS Data
            </a>
        </li>
    )

    const logoutButton = (
        <li className="nav-item active">
            <a className="nav-link"
                onClick={sendLogout}
                onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                style={{ color: 'whitesmoke' }}
                href='#'>
                Logout
            </a>
        </li>
    )

    const backButton = (
        <li className="nav-item active">
            <a className="nav-link"
                onClick={() => navigate(-1)}
                onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                style={{ color: 'whitesmoke' }}
                href='#'>
                <span className="sr-only">(current)</span>
                <FontAwesomeIcon icon={faArrowCircleLeft} />
            </a>
        </li>
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
                    <nav className="navbar navbar-expand navbar-light">
                        <Link style={{ color: 'whitesmoke', textDecoration: 'none' }} to="/site">
                            <div><span style={{ fontSize: '20px' }}> <b>Cost Tracking</b></span> <span >--- {pathname}</span>
                                {/* <div>activity info</div> */}
                            </div>
                        </Link>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    {/* <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Dropdown
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a class="dropdown-item" href="#">Action</a>
                                        <a class="dropdown-item" href="#">Another action</a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#">Something else here</a>
                                    </div> */}

                                    <a className="nav-link dropdown-toggle"
                                        onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                                        onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                                        style={{ color: 'whitesmoke' }}

                                        id="navbarDropdownMenuLink"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        Dropdown link
                                    </a>
                                    <div aria-labelledby="navbarDropdownMenuLink" className="dropdown-menu">
                                        <a className="dropdown-item" href="#">Action</a>
                                        <a className="dropdown-item" href="#">Another action</a>
                                        <a className="dropdown-item" href="#">Something else here</a>
                                    </div>


                                    {/* <NavDropdown
                                        title="Dropdown"
                                        id="basic-nav-dropdown"
                                        style={{ color: 'whitesmoke' }}
                                        onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                                        onMouseOut={(e) => e.target.style.color = 'whitesmoke'}
                                    // style={{ color: 'whitesmoke' }}
                                    >
                                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">
                                            Another action
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">
                                            Separated link
                                        </NavDropdown.Item>
                                    </NavDropdown> */}



                                </li>
                            </ul>
                        </div>
                    </nav>

                    <nav className="navbar navbar-expand navbar-light site-header__nav">
                        <div className="collapse navbar-collapse" id="navbar">
                            <ul className="navbar-nav">
                                {buttonContent}
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default SiteHeader