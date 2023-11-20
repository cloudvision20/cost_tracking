import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'


const Welcome = () => {

    const { username, employeename, isManager, isAdmin, status, location } = useAuth()

    useTitle(`Cost Tracking: ${username}`)

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    let content = (
        <section className="welcome">
            <div className="container" style={{ fontSize: '12px' }}>
                <div id="welcome" style={{ marginTop: "50px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <p>{today}</p>

                    <h4>Welcome {employeename}!</h4>
                    {(location === 'HQ')
                        &&
                        <>
                            <p><Link to="/dash/dailyReports">View Cost Tracking Daily Reports</Link></p>
                            <p><Link to="/dash/dailyReports/new">Add New Daily Report</Link></p>
                        </>
                    }

                    {(location === 'HQ' || isManager || isAdmin)
                        &&
                        <>
                            <p><Link to="/dash/users">View User Settings</Link></p>
                            <p><Link to="/dash/users/new">Add New User</Link></p>
                        </>
                    }
                </div>
            </div>
        </section>
    )

    return content
}
export default Welcome