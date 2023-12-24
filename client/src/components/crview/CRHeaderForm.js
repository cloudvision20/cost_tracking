import { useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

// import { useSelector } from 'react-redux'
// import { selectActivity } from '../crview/crviewSlice'

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';


const CRHeaderForm = () => {
    // const [curActivityId, setCurActivityId] = useState('')
    const onMouseOverNavLink = (e) => { e.target.style.color = 'rgba(110, 110, 110, 0.9)' }
    const onMouseOutNavLink_Whitesmoke = (e) => { e.target.style.color = 'whitesmoke' }
    const onMouseOutNavLink_Blue = (e) => { e.target.style.color = 'blue' }
    const navLinkStyle_Whitesmoke = { color: 'whitesmoke', fontSize: '14px' }
    // const navLinkStyle_ws = { color: 'whitesmoke', fontSize: '14px', backgroundColor: '#212f51' }
    // const navLinkStyle_blue = { color: 'blue', fontSize: '14px' }
    const navLnkStyle_Btn = "btn btn-light"
    //const activities = useSelector(selectActivity)
    // const onActivitiesSelected = (activityId) => { console.log(activityId) }


    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])



    // const onNewDailyReportSelected = () => navigate('/crview/dailyReports/new')
    // const onDailyReportSelected = () => navigate('/crview/dailyReports')
    // const onUserSelected = () => navigate('/crview/users')
    const onOverviewClicked = () => navigate('/crview/overview')
    const onConsumablesClicked = () => navigate('/crview/consumables')
    const onManhourClicked = () => navigate('/crview/manhour')
    const onExpensesClicked = () => navigate('/crview/expenses')
    // const onMastersSelected = (item) => {
    //     switch (item) {
    //         case 'Consumables':
    //             navigate('/crview/consumables')
    //             break;
    //         case 'Equipment':
    //             navigate('/crview/equipment')
    //             break;
    //         case 'Expenses':
    //             navigate('/crview/expenses')
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // const onFormSelected = (item) => {
    //     switch (item) {

    //         case 'Consumables':
    //             navigate('/crview/records/consumable')
    //             break;
    //         case 'Equipment':
    //             navigate('/crview/records/equip')
    //             break;
    //         case 'Expenses':
    //             navigate('/crview/records/expense')
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // const onFormsSelected = (item) => {
    //     switch (item) {

    //         case 'Consumables':
    //             navigate('/crview/records/consumables')
    //             break;
    //         case 'Equipment':
    //             navigate('/crview/records/equipment')
    //             break;
    //         case 'Expenses':
    //             navigate('/crview/records/expenses')
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // const onAttendsSelected = (item) => {
    //     switch (item) {

    //         case 'upload':
    //             navigate('/crview/files/manHour')
    //             break;
    //         case 'record':
    //             navigate('/crview/attends')
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // let newDailyReportMenu = null
    // newDailyReportMenu = (
    //     <NavDropdown.Item href="#newDailyReports"
    //         key={`newDailyReports`}
    //         onMouseOver={onMouseOverNavLink}
    //         onMouseOut={onMouseOutNavLink_Blue}
    //         style={navLinkStyle_blue}
    //         title="New Daily Report"
    //         onClick={onNewDailyReportSelected}
    //     >
    //         New Daily Report
    //     </NavDropdown.Item>
    // )

    // let dailyReportMenu = null
    // dailyReportMenu = (
    //     <NavDropdown.Item href="#dailyReports"
    //         key={`dailyReports`}
    //         onMouseOver={onMouseOverNavLink}
    //         onMouseOut={onMouseOutNavLink_Blue}
    //         style={navLinkStyle_blue}
    //         title="Daily Reports"
    //         onClick={onDailyReportSelected}
    //     >
    //         Daily Reports
    //     </NavDropdown.Item>
    // )

    // let navUserMenu = null
    // navUserMenu = (
    //     <NavDropdown.Item href="#users"
    //         key={`users`}
    //         onMouseOver={onMouseOverNavLink}
    //         onMouseOut={onMouseOutNavLink_Blue}
    //         style={navLinkStyle_blue}
    //         title="Users"
    //         onClick={onUserSelected}
    //     >
    //         Users
    //     </NavDropdown.Item>
    // )
    // let navTypeMenu = null
    // navTypeMenu = (
    //     <NavDropdown.Item href="#types"
    //         key={`types`}
    //         onMouseOver={onMouseOverNavLink}
    //         onMouseOut={onMouseOutNavLink_Blue}
    //         style={navLinkStyle_blue}
    //         title="Types"
    //         onClick={onTypeSelected}
    //     >
    //         Types
    //     </NavDropdown.Item>
    // )
    // // let navActivitiesMenu
    // // if (activities) {

    // //     navActivitiesMenu = activities.map(activity => {
    // //         return (
    // //             <NavDropdown.Item href="#activity._id"
    // //                 key={activity._id}
    // //                 onMouseOver={onMouseOverNavLink}
    // //                 onMouseOut={onMouseOutNavLink_Blue}
    // //                 onClick={() => onActivitiesSelected(activity._id)}
    // //                 style={navLinkStyle_blue}
    // //             >
    // //                 {activity.name}
    // //             </NavDropdown.Item>
    // //         )
    // //     });
    // // }
    // const masters = [
    //     { '_id': 'Consumables', 'name': 'Consumables' },
    //     { '_id': 'Equipment', 'name': 'Equipment' },
    //     { '_id': 'Expenses', 'name': 'Expenses' }]
    // let navMasterMenu

    // navMasterMenu = masters.map(item => {
    //     return (
    //         <NavDropdown.Item href="#Masters"

    //             key={item._id}
    //             onMouseOver={onMouseOverNavLink}
    //             onMouseOut={onMouseOutNavLink_Blue}
    //             onClick={() => onMastersSelected(item._id)}
    //         >
    //             {item.name}
    //         </NavDropdown.Item>
    //     )
    // })
    // const form = [
    //     { '_id': 'Consumables', 'name': 'Consumables (Single record) form' },
    //     { '_id': 'Equipment', 'name': 'Equipment (Single record) form' },
    //     { '_id': 'Expenses', 'name': 'Expenses (Single record) form' }]
    // let navFormMenu
    // navFormMenu = form.map(item => {
    //     return (
    //         <NavDropdown.Item
    //             key={item._id}
    //             onMouseOver={onMouseOverNavLink}
    //             onMouseOut={onMouseOutNavLink_Blue}
    //             onClick={() => onFormSelected(item._id)}
    //         >
    //             {item.name}
    //         </NavDropdown.Item>
    //     )
    // })

    // const forms = [
    //     { '_id': 'Consumables', 'name': 'Consumables form' },
    //     { '_id': 'Equipment', 'name': 'Equipment form' },
    //     { '_id': 'Expenses', 'name': 'Expenses form' }]
    // let navFormsMenu
    // navFormsMenu = forms.map(item => {
    //     return (
    //         <NavDropdown.Item
    //             key={item._id}
    //             onMouseOver={onMouseOverNavLink}
    //             onMouseOut={onMouseOutNavLink_Blue}
    //             onClick={() => onFormsSelected(item._id)}
    //         >
    //             {item.name}
    //         </NavDropdown.Item>
    //     )
    // })

    // const attends = [
    //     { '_id': 'upload', 'name': 'Upload Attendance csv file' },
    //     { '_id': 'record', 'name': 'view attendance' }]
    // let navAttendsMenu
    // navAttendsMenu = attends.map(item => {
    //     return (
    //         <NavDropdown.Item
    //             key={item._id}
    //             onMouseOver={onMouseOverNavLink}
    //             onMouseOut={onMouseOutNavLink_Blue}
    //             onClick={() => onAttendsSelected(item._id)}
    //         >
    //             {item.name}
    //         </NavDropdown.Item>
    //     )
    // })

    let overviewNavLink = null
    overviewNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={onOverviewClicked}
            nMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Overview"
        >
            Overview
        </Nav.Link>
    )

    let consumablesNavLink = null
    consumablesNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={onConsumablesClicked}
            nMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Consumables"
        >
            Consumables
        </Nav.Link>
    )

    let manhourNavLink = null
    manhourNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={onManhourClicked}
            onMouseOver={onMouseOverNavLink}

            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Man hour"
        >
            Man hour

        </Nav.Link>
    )

    let expensesNavLink = null
    expensesNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={onExpensesClicked}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Expenses"
        >
            Expenses
        </Nav.Link>
    )

    const logoutNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={sendLogout}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Logoout"
        >
            Logout
        </Nav.Link>
    )

    const backNavLink = (
        <Nav.Link
            className={navLnkStyle_Btn}
            onClick={() => navigate(-1)}
            onMouseOver={onMouseOverNavLink}
            onMouseOut={onMouseOutNavLink_Whitesmoke}
            style={navLinkStyle_Whitesmoke}
            title="Back"
        >
            <span className="sr-only">(current)</span>
            <FontAwesomeIcon icon={faArrowCircleLeft} />
        </Nav.Link>
    )

    const blankNavLink = (
        <Nav.Link
            disabled="true"
            title="Blank"
        >&nbsp;&#9;&#9;&nbsp;
        </Nav.Link>
    )
    const errClass = isError ? "errmsg" : "offscreen"

    let navLinkContent
    if (isLoading) {

        navLinkContent = <PulseLoader color={"#FFF"} />
    } else {
        navLinkContent = (
            <>
                {backNavLink}
                {overviewNavLink}
                {manhourNavLink}
                {consumablesNavLink}
                {expensesNavLink}
                {/* {equipmentNavLink} */}

                {/* {consumablesNavLink} */}

            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <div className="cr-header">
                <div className="container-xl  ct-header__container">
                    <Navbar expand="lg"  >
                        <Navbar.Brand href="/crview" style={navLinkStyle_Whitesmoke} >
                            <div>
                                <span style={{ fontSize: '20px' }}> <b>Cost Tracking Control Room</b></span>
                                {/* <span style={{ fontSize: '14px' }}> --- {pathname}</span> */}
                            </div>
                        </Navbar.Brand>
                    </Navbar>
                    <Navbar bg="backgroundColor: #212f51" >
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" >
                            <Nav className="ms-auto" >
                                {navLinkContent}
                                {/* <NavDropdown
                                    title={< span style={navLinkStyle_Whitesmoke}
                                        onMouseOver={onMouseOverNavLink}
                                        onMouseOut={onMouseOutNavLink_Whitesmoke}
                                    >Attendance Menu</span>}
                                    id="basic-nav-dropdown">
                                    {navAttendsMenu}
                                </NavDropdown>


                                <NavDropdown
                                    title={< span style={navLinkStyle_Whitesmoke}
                                        onMouseOver={onMouseOverNavLink}
                                        onMouseOut={onMouseOutNavLink_Whitesmoke}
                                    >Master Menu</span>}
                                    id="basic-nav-dropdown">
                                    {navMasterMenu}
                                    <NavDropdown.Divider />
                                    {navUserMenu}
                                    <NavDropdown.Divider />
                                    {navTypeMenu}
                                </NavDropdown>
                                <NavDropdown
                                    title={< span style={navLinkStyle_Whitesmoke}
                                        onMouseOver={onMouseOverNavLink}
                                        onMouseOut={onMouseOutNavLink_Whitesmoke}
                                    >Records Menu</span>}
                                    id="basic-nav-dropdown">
                                    {navFormsMenu}
                                    {navFormMenu}
                                    <NavDropdown.Divider />
                                    {dailyReportMenu}
                                    {newDailyReportMenu}
                                </NavDropdown> */}
                                {/* <NavDropdown
                                    title={
                                        < span style={navLinkStyle_Whitesmoke}
                                            onMouseOver={onMouseOverNavLink}
                                            onMouseOut={onMouseOutNavLink_Whitesmoke}
                                        >Select Activity</span>}

                                    id="basic-nav-dropdown">
                                    {navActivitiesMenu}
                                </NavDropdown> */}
                                {blankNavLink}
                                {logoutNavLink}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </>
    )
    return content
}
export default CRHeaderForm