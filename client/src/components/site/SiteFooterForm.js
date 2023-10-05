import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
// import useAuth from "../../hooks/useAuth"

const SiteFooter = ({ userid, username, status, activities }) => {

    // const { userid, username, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/site')

    let goHomeButton = null
    if (pathname !== '/site') {
        goHomeButton = (
            <button
                className="btn btn-primary"
                style={{ padding: "3px", height: "90%", fontSize: "14px" }}
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }
    console.log(activities)

    const content = (
        <footer className="site-footer">
            {goHomeButton}
            <p>Current User: {username}</p>
            <p>User Id: {userid}</p>
            <p>Status: {status}</p>
            <p>Activity: {activities.name}</p>
        </footer>
    )
    return content
}
export default SiteFooter