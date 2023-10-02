import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'


const Welcome = () => {

    const { username, isManager, isAdmin, status, location } = useAuth()

    useTitle(`Site: ${username}`)

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    let content = (
        <section className="welcome">
            <div className="container">
                <div id="welcome" style={{ marginTop: "50px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <p>{today}</p>

                    <h3>Welcome {username}!</h3>
                    {(location === 'Site')
                        &&
                        <>
                            <p><Link to="/site/consumables">Consumable List</Link></p>
                            <p><Link to="/site/consumables/new">New Consumable</Link></p>
                        </>
                    }

                    {(location === 'HQ' || isManager || isAdmin)
                        &&
                        <>
                            <p><Link to="/site/users">View User Settings</Link></p>
                            <p><Link to="/site/users/new">Add New User</Link></p>
                        </>
                    }
                </div>
            </div>
        </section>
    )

    return content
}
export default Welcome