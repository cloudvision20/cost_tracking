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
// import { usePostHrsByEIdSEQuery } from '../attendance/attendsApiSlice'
import { useGetActivitiesGBProjsQuery } from '../crview/crviewsApiSlice'
// import { usePostHrsByEIdSEQuery, useGetActivitiesGBProjsQuery } from '../crview/crviewsApiSlice'
// import { useGetActivitiesQuery} from '../activities/activitiesApiSlice'
// import { useGetProjectsQuery } from '../projects/projectsApiSlice'
const Welcome = () => {
    const { userid, username, employeename, isManager, isAdmin, status, location } = useAuth()
    useTitle(`Site: ${username}`)

    // const {
    //     data: activities1,
    //     isLoading
    //     // ,
    //     // isSuccess,
    //     // isError,
    //     // error
    // } = useGetActivitiesQuery('activitiesList', {
    //     pollingInterval: 15000,
    //     refetchOnFocus: true,
    //     refetchOnMountOrArgChange: true
    // })
    const { data: projects } = useGetActivitiesGBProjsQuery({
        "start": "1-07-2023",
        "end": "18-07-2023"
    })
    // const { data: projects, isSuccess, isError, error } = usePostHrsByEIdSEQuery({
    //     "start": "1-07-2023",
    //     "end": "18-07-2023"
    // })
    const Activities = useSelector(selectActivity)
    const activities = Activities.activities
    let currActivityId = Activities.current.activityId
    let currActivityName = Activities.current.name
    //console.log(`sitewelcome activities:${JSON.stringify(activities)}`)
    // console.log(`activities.length : ${activities?.length}`)
    // const { data: attends, isSuccess, isError, error } = usePostHrsByEIdSEQuery({
    //     "eid": "96",
    //     "start": "1-07-2023",
    //     "end": "18-07-2023"
    // })
    const [updateUsers, {
        //isLoading, isSuccess, isError, error
    }] = useUpdateUsersMutation()

    // const onCurrActivtyChange = (e) => {
    //     e.preventDefault()
    //     const value = Array.from(
    //         e.target.selectedOptions,
    //         (option) => option.value
    //     )
    //     setTimeout(() => {
    //         try {
    //             updateDefaultActivity(e.target[e.target.selectedIndex].value)
    //         } catch (err) {
    //             console.log(`siteWelcome updateDefaultActivity error: ${err}`)
    //         }
    //     }, 500)
    // }
    // const updateDefaultActivity = (activityId) => {
    //     let user = {}
    //     user._id = userid
    //     user.currActivityId = activityId
    //     let req = {}
    //     req.data = [user]
    //     updateUsers(req)
    //         .then((result) => {
    //             window.location.reload(false);
    //         }).catch((error) => {
    //             console.log(`error: ${error}`)
    //         })
    // }
    let options
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
    let projectList
    if (projects) {
        projectList = projects?.map((project, index) => {
            return (
                <>
                    <div className='row' style={{ borderTop: "1px solid black" }}>
                        <div className='col-sm-1'>
                            {index + 1}
                        </div>

                        <div className='col-sm-2'> <b>{project.title}</b> </div >
                        <div className='col-sm-6' >
                            <div className='row'>
                                <div className='col-sm-3'>
                                    <div> <b> Labour </b></div>
                                    <div> <b> Equipment </b></div>
                                    <div> <b> Consumables </b></div>
                                </div>
                                <div className='col-sm-3'>
                                    <div>  {project.ttlPlanLabour}</div>
                                    <div> {project.ttlPlanEquipment}</div>
                                    <div> {project.ttlPlanConsumables}</div>
                                </div>
                                <div className='col-sm-3'>
                                    <div> {project.ttlActualLabour}</div>
                                    <div> </div>
                                    <div>{project.ttlActualConsumables} </div>
                                </div>
                                <div className='col-sm-3'>
                                    <div> {project.percentLabour}</div>
                                    <div> </div>
                                    <div> </div>
                                </div>

                            </div>
                        </div>

                        <div className='col-sm-3'>

                            {project.activities.map((activity, index) => {
                                return (
                                    <div className='row'>
                                        <div className='col-sm-1'> {index + 1} </div>
                                        <div className='col-sm-11'> {activity.name}</div >
                                    </div>


                                )
                            })}

                        </div>

                    </div >
                    <div className='row'><p>  </p></div>
                </>

            )

        });
    }

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    let content = (
        <section className="welcome">
            <div className="ct-container" style={{ fontSize: '12px' }}>

                <div id="welcome" style={{ marginTop: "50px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-12 col-sm-offset-2">
                    <p>{today}</p>

                    <h4>Control Room Overview !</h4>
                    {/* <br />

                    <p> Select Project -- activity</p>
                    <p> get a list of all project - activities.</p>
                    <p> Select Employee -- all or Single</p>

                    <p><Link to="/crview/manhour">show manhour</Link></p> */}

                </div>
                <div className='container' style={{ border: "1px solid black" }}>
                    <div className='row' >
                        <div className='col-sm-1'>
                            <b>#</b>
                        </div>
                        <div className='col-sm-2'>
                            <b>Project Title</b>
                        </div>
                        <div className='col-sm-6'>
                            <div className='row'>
                                <b>Project Status</b>
                            </div>
                            <div className='row'>
                                <div className='col-sm-3'>
                                    <div> <b>  </b></div>
                                </div>
                                <div className='col-sm-3'>
                                    <div> <b> Plan / Budget </b></div>
                                </div>
                                <div className='col-sm-3'>
                                    <div> <b> Actual </b></div>
                                </div>
                                <div className='col-sm-3'>
                                    <div> <b> Percent Completion </b></div>
                                </div>

                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <b>Activities Lists</b>
                        </div>

                    </div>

                    <div>
                        {projectList}
                    </div>


                    {/* </div> */}
                    {/* <div className='row'>
                            <div className='col-sm-12'>
                                <p>
                                    {JSON.stringify(projects)}
                                </p>
                            </div>
                        </div> */}
                </div>
            </div>
        </section >
    )
    return content
}
export default Welcome