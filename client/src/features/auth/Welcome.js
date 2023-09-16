import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import FilesUpload from '../files/FilesUpload'

const Welcome = () => {

    const { username, isManager, isAdmin } = useAuth()

    useTitle(`Cost Tracking: ${username}`)

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section className="welcome">
            <div className="container">
                <div id="welcome" style={{ marginTop: "50px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <p>{today}</p>

                    <h3>Welcome {username}!</h3>

                    <p><Link to="/dash/dailyReports">View Cost Tracking Daily Reports</Link></p>

                    <p><Link to="/dash/dailyReports/new">Add New Daily Report</Link></p>

                    {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

                    {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
                </div>
            </div>
            <div className="container" style={{ width: "600px" }}>
                <div style={{ margin: "20px" }}>
                    <h4>uploaded files</h4>
                </div>

                <FilesUpload />
            </div>
        </section>
    )

    return content
}
export default Welcome