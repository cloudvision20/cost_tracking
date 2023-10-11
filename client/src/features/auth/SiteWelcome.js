import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import { useEffect, useState, useContext } from "react"
//import ActivitiesContext from '../../context/ActivitiesContext'
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'
const Welcome = () => {

    const { username, isManager, isAdmin, status, location } = useAuth()
    useTitle(`Site: ${username}`)
    const [currentActivity, setCurrentActivity] = useState('')
    const activities = useSelector(selectActivity)
    //const { activities } = useContext(ActivitiesContext)


    const onActivitiesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setCurrentActivity(values)
    }
    let options
    useEffect(() => {
        //setCurrentActivity(activities[0]._id)
    }, []);
    if (activities) {

        options = activities.map(activity => {
            return (
                <option
                    key={activity._id}
                    value={activity.name}

                > {activity.name}</option >
            )
        });
    }

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    let content = (
        <section className="welcome">
            <div className="container" style={{ fontSize: '12px' }}>
                <div id="welcome" style={{ marginTop: "50px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <p>{today}</p>

                    <h4>Welcome {username}!</h4>
                    {(location === 'Site' && activities?.length > 1)
                        &&
                        <>
                            <p><Link to="/site/consumables">Consumable List</Link></p>
                            <p><Link to="/site/consumables/new">New Consumable</Link></p>
                            {/* 
                            <div className="form-group row">
                                <div className="col-sm-2"><b> Activities:</b></div>
                                <div className="col-sm-6">
                                    <select
                                        id="activities"
                                        name="activities"
                                        className="form-control"
                                        multiple={true}
                                        size="1"
                                        value={activities}
                                        onChange={onActivitiesChanged}
                                    >
                                        {options}
                                    </select>
                                </div>
                            </div> */}
                        </>
                    }
                    {(location === 'Site' && activities?.length === 1)
                        &&
                        <>
                            <p><Link to="/site/consumables"
                                onMouseOver={(e) => e.target.style.color = 'rgba(110, 110, 110, 0.9)'}
                                onMouseOut={(e) => e.target.style.color = 'blue'}
                                style={{ color: 'blue' }}
                            >Consumable List</Link></p>
                            <p><Link to="/site/consumables/new">New Consumable</Link></p>

                            <div className="form-group row">
                                <div className="col-sm-4"><b> Activities:</b></div>
                                <div className="col-sm-6"> {activities[0].name}

                                </div>
                            </div>
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