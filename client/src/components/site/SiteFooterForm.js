import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'

const SiteFooter = ({ userid, username, employeename, status, activities }) => {
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
    //console.log(activities)

    const content = (

        <div className="ct-footer">
            {goHomeButton}
            <p>Current User: {username}</p>
            <p>User Id: {userid}</p>
            <p>Status: {status}</p>
            <p>Activity: {activities.current.name}</p>
        </div>

    )
    return content
}
export default SiteFooter