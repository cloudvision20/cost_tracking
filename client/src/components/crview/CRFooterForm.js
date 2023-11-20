import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'

const CCRFooter = ({ userid, username, status, activities }) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/crview')

    let goHomeButton = null
    if (pathname !== '/crview') {
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

        <div className="cr-footer">
            {/* {goHomeButton} */}
            <p>Current User: {username} &nbsp;&#9;&#9;&nbsp;</p>
            <p>User Id: {userid}&nbsp;&#9;&#9;&nbsp;</p>
            <p>Status: {status}&nbsp;&#9;&#9;&nbsp;</p>
            {/* <p>Activity: {activities.current.name}</p> */}
        </div>

    )
    return content
}
export default CCRFooter