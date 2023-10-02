import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from "../../hooks/useAuth"

const SiteFooter = () => {

    const { username, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/site')

    let goHomeButton = null
    if (pathname !== '/site') {
        goHomeButton = (
            <button
                className="btn btn-primary"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="site-footer">
            {goHomeButton}
            <p>Current User: {username}</p>
            <p>Status: {status}</p>
        </footer>
    )
    return content
}
export default SiteFooter