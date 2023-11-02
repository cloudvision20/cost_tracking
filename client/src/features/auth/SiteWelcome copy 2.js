/******************************************************************************
 * TODO: 
 * 1. Add option to switch default Activity Nov 3 2023
 * - add a toggle button to Enable / Disable the function ( the div container)
 * - new <div> container starts hidden
 * - prepare activities option from user activity list
 * - update to user and refresh.
 *******************************************************************************/
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
// import { useEffect, useState, useContext } from "react"
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'
import { useUpdateUsersMutation, useUpdateUserMutation } from '../users/usersApiSlice';
const Welcome = () => {
    const { userid, username, isManager, isAdmin, status, location } = useAuth()
    useTitle(`Site: ${username}`)

    let Activities = useSelector(selectActivity)

    const activities = Activities.activities
    let currActivityId = Activities.current.activityId
    let currActivityName = Activities.current.name
    //console.log(`sitewelcome activities:${JSON.stringify(activities)}`)
    // console.log(`activities.length : ${activities?.length}`)

    const [updateUsers, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUsersMutation()

    const onCurrActivtyChange = (e) => {
        e.preventDefault()
        const value = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setTimeout(() => {
            try {
                updateDefaultActivity(e.target[e.target.selectedIndex].value)
            } catch (err) {
                console.log(`siteWelcome updateDefaultActivity error: ${err}`)
            }
        }, 500)
    }

    let options

    const updateDefaultActivity = (activityId) => {
        let user = {}
        user._id = userid
        user.currActivityId = activityId
        let req = {}
        req.data = [user]
        updateUsers(req)
            .then((result) => {
                window.location.reload(false);
            }).catch((error) => {
                console.log(`error: ${error}`)
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
        if (!currActivityId && activities?.length === 1) {
            setTimeout(() => {
                currActivityName = activities[0]?.name
            }, 1500)
        } else {
            currActivityName = activities?.map(activity => {
                if (activity._id === currActivityId) {
                    return (activity.name)
                }
            })
        }
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
                    {(!currActivityId && activities?.length === 0)
                        &&
                        <>
                            <div className="form-group row" style={{ fontSize: '14px' }}>
                                <div className="col-sm-6"><b>No Activity assigned to {username} </b></div>
                                <div className="col-sm-6" ><b></b>
                                </div>
                            </div>
                        </>
                    }
                    {(currActivityId && activities?.length >= 1)
                        &&
                        <>
                            <div className="form-group row" style={{ fontSize: '14px' }}>
                                <div className="col-sm-4"><b>Default Activity: </b></div>
                                <div className="col-sm-6" ><b>{currActivityName}</b>
                                </div>
                            </div>
                        </>
                    }

                    {(!currActivityId && activities?.length > 1)
                        &&
                        <>
                            <div className="form-group row">
                                <div className="col-sm-4"><b>Choose a default Activity to continue</b></div>
                                <div className="col-sm-8" >
                                    <Form.Select
                                        title="-- Select Activity --"
                                        id="activities"
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
                    <br />


                    {(location === 'Site')
                        &&
                        <>
                            <div className="row" style={{ fontSize: '14px' }}>
                                <p><Link to="/site/consumables">Consumables </Link></p>
                                <p><Link to="/site/equipment">Equipment</Link></p>
                                <p><Link to="/site/expenses">Expenses</Link></p>
                            </div>
                        </>
                    }
                    {(location === 'HQ' || isManager || isAdmin)
                        &&
                        <>
                            <div className="row" style={{ fontSize: '14px' }}>
                                <p><Link to="/site/users">View User Settings</Link></p>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
        </section >
    )

return content
}
export default Welcome