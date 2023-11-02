import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import { useEffect, useState, useContext } from "react"
import Form from 'react-bootstrap/Form';
//import ActivitiesContext from '../../context/ActivitiesContext'
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'
import { useUpdateUsersMutation, useUpdateUserMutation } from '../users/usersApiSlice';
const Welcome = () => {

    const { currActivityId, userid, username, isManager, isAdmin, status, location } = useAuth()
    useTitle(`Site: ${username}`)
    const [currentActivity, setCurrentActivity] = useState('')
    const activities = useSelector(selectActivity)

    // console.log(`activities:${JSON.stringify(activities)}`)
    // console.log(`activities.length : ${activities?.length}`)


    const [updateUsers, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUsersMutation()

    const onCurrActivtyChange = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setCurrentActivity(values)
        console.log(`selected option: ${values}`)
    }
    let options
    useEffect(() => {
        setCurrentActivity(currActivityId)
    }, [currActivityId]);

    let currActivityName
    const updateDefaultActivity = (activityId) => {
        let user = {}
        user._id = userid
        user.currActivityId = activityId
        let req = {}
        req.data = [user]
        updateUsers(req)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {

            })
    }
    if (activities) {

        options = activities?.map(activity => {
            return (
                <option
                    key={activity._id}
                    value={activity._id}

                > {activity.name}</option >
            )
        });
        if (!currentActivity && activities?.length === 1) {
            setTimeout(() => {
                setCurrentActivity(activities[0]?._id)
                updateDefaultActivity(activities[0]?._id)
            }, 1000)
        }
        currActivityName = activities?.map(activity => {
            if (activity._id === currentActivity) {
                return (activity.name)
            }
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
                    <br />
                    {(!currentActivity && activities?.length === 0)
                        &&
                        <>

                            <div className="form-group row" style={{ fontSize: '14px' }}>
                                <div className="col-sm-6"><b>No Activity assigned to {username} </b></div>
                                <div className="col-sm-6" ><b></b>
                                </div>
                            </div>
                            <br />
                            <br />
                        </>
                    }
                    {(activities?.length === 1)
                        &&
                        <>

                            <div className="form-group row" style={{ fontSize: '14px' }}>
                                <div className="col-sm-4"><b>Default Activity: </b></div>
                                <div className="col-sm-6" ><b>{currActivityName}</b>
                                </div>
                            </div>

                        </>

                    }

                    {(!currentActivity && activities?.length > 1)
                        &&
                        <>

                            <div className="form-group row">
                                <div className="col-sm-4"><b>Choose a default Activity to continue</b></div>
                                <div className="col-sm-6" >
                                    <Form.Select
                                        title="-- Select Activity --"
                                        id="activities"
                                        name="activities"
                                        className="form-select form-select-sm"
                                        style={{ fontSize: '11px' }}
                                        multiple={false}
                                        size="l"
                                        onChange={onCurrActivtyChange}
                                    >
                                        <option>Choose default Activity:</option>
                                        {options}
                                    </Form.Select>
                                </div>
                            </div>
                        </>

                    }
                    {(location === 'Site')
                        &&
                        <>
                            <p><Link to="/site/consumables">Consumables </Link></p>
                            <p><Link to="/site/equipment">Equipment</Link></p>
                            <p><Link to="/site/expenses">Expenses</Link></p>
                        </>
                    }

                    {/* {(location === 'Site' && activities?.length > 1)
                        &&
                        <>
                            <p><Link to="/site/consumables">Consumable List</Link></p>
                            <p><Link to="/site/consumables/new">New Consumable</Link></p>

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
                    } */}
                    {(location === 'HQ' || isManager || isAdmin)
                        &&
                        <>
                            <p><Link to="/site/users">View User Settings</Link></p>
                            {/* <p><Link to="/site/users/new">Add New User</Link></p> */}


                        </>
                    }

                </div>
            </div>
        </section>
    )

    return content
}
export default Welcome