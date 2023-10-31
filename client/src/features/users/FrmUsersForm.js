import { useState, useEffect, useMemo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateUsersMutation, useDeleteUserMutation } from './usersApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { Form } from 'react-bootstrap';
import { date2Weekday, dateForPicker } from "../../hooks/useDatePicker"
import useAuth from "../../hooks/useAuth"

let eUsers = {}
// Button definition for buttons in Ag-grid
const btnStyle = { padding: "2px", height: "70%", fontSize: "11px" }
const divButton = { display: "flex", flexFlow: "row nowrap", justifyContent: "flex-start", padding: "1px", gap: "0.5em" }

class BtnCellRenderer extends Component {
    constructor(props, Id) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
        this.btnDelClickedHandler = this.btnDelClickedHandler.bind(this);
    }
    btnClickedHandler() {
        this.props.clicked(this.props.value);
    }
    btnDelClickedHandler(e) {
        //e.preventDefault()
        this.props.delClicked(this.props);
    }
    render() {
        return (
            <div className="form-group -ct-header__nav " style={divButton}>
                <button className="btn btn-danger btn-sm" style={btnStyle} onClick={this.btnDelClickedHandler}>Del</button>
            </div>
        )
    }
}
const FrmUsersForm = ({ res }) => {
    const { userid, username, status, isManager, isAdmin } = useAuth()
    const blankData = { "type": "", "details": "", "description": "", "amount": 0, "_id": null, "userId": userid }
    let users = {}
    let activities = {}
    if (res) {
        if (res.users) {
            users = res.users
            if (users._id === 'new') { users.userId = userid }
        }
        if (res.activities) {
            activities = res.activities
        }
    }

    let msgContent = ''
    const msgRef = useRef();

    if (!users) {
        msgContent = 'New User database'
        msgRef.className = 'resmsg'
        users = { blankData }
    } else {
        msgRef.className = 'offscreen'
        msgContent = ''
    }
    const [updateUsers, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUsersMutation()
    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()
    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const userGridRef = useRef();

    let data = Array.from(users).map((data, index) => ({
        "id": data._id,
        "username": data.username,
        "password": data.password,

        "employeeId": data.employeeId,
        "employeeName": data.employeeName,
        "contactInfo": JSON.stringify(data?.contactInfo),
        "roles": data.roles?.toString().replaceAll(',', ', '),
        "currActivityId": data.currActivityId?._id,
        "currActivity": data.currActivityId?.name,
        "active": data.active,
        "_id": data._id
    }))

    const [rdUser, setRdUser] = useState(data)
    const [userColDefs] = useState([
        { field: 'id', headerName: 'user Id', width: 100, hide: true },
        { field: '_id', headerName: '_id', width: 100, hide: true },

        { field: 'employeeId', headerName: 'Employee Id', width: 100, editable: false },
        { field: "employeeName", headerName: 'Employee Name', width: 160, editable: false },
        { field: "username", headerName: 'Username', width: 150, editable: false },
        // { field: 'password', headerName: 'Password', width: 150, editable: false },
        { field: "contactInfo", headerName: 'Contact Info', width: 200, editable: false },
        { field: 'roles', headerName: 'Roles', width: 200, editable: false },
        { field: "currActivityId", headerName: 'Default Activity Id', width: 150, editable: false },
        { field: "currActivity", headerName: 'Default Activity', width: 300, editable: false },
        { field: 'active', headerName: 'Active', width: 75, editable: false },
        {
            headerName: 'Actions',
            width: 75,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {

                    if (this.data._id) { delUser(this.data._id) }
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "user"
            },
            editable: false,
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onSaveClicked = async (e) => {
        e.preventDefault()
        eUsers.data = rdUser
        await updateUsers(eUsers)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                data = result.data.data.map((data, index) => ({
                    "userId": data.userId,
                    "activityId": data.activityId,
                    "employeeId": data.employeeId,
                    "employeeName": data.employeeName,
                    "clockType": data.description,
                    "date": data.date,
                    "time": data.time,
                    "weekday": data.weekday,
                    "dateTime": data.dateTime,
                    "terminal": data.terminal,
                    "_id": data._id
                }))
                setRdUser(data)
                userGridRef.current.api.refreshCells()
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                msgRef.className = "offscreen"
            })
    }

    const delUser = async (_id) => {
        await deleteUser({ id: _id })
            .then((result) => {


            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                let rData = []
                userGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdUser(rData)
            }
            )
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdUser))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdUser ?
                [...rdUser, blankData]
                : [blankData]
        setRdUser(newRData)
    }
    const errRef = useRef();
    useEffect(() => {
        errRef.className = "resmsg"
        isSuccess ? errContent.current = " Saved!"
            : errContent.current = "Deleted!"
    }, [isSuccess, isDelSuccess, navigate])

    // useEffect(() => {
    //     console.log('useEffect-rowData: \n' + JSON.stringify(rdUser))
    // })
    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent.current}</p>


            <div className="container grid_system" style={{ fontSize: '12px', borderTop: "1px solid blue", borderLeft: "1px solid blue", borderBottom: "1px solid blue", borderRight: "1px solid blue" }}>

                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px" }}><br /><h4><b>User Details</b></h4></div>
                </div>
                {/* <div className="form-group  ct-header__nav">
                    <button
                        className="btn btn-primary"
                        title="New"
                        onClick={onNewClicked}
                    >
                        <FontAwesomeIcon icon={faPlusSquare} />
                    </button>
                    <button
                        className="btn btn-primary"
                        title="Save"
                        onClick={onSaveClicked}
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </div> */}
                <div className="container-sm ag-theme-balham" style={{ height: "600px", width: "100%", fontSize: '12px' }}>
                    <p ref={msgRef} className="" >{msgContent}</p>
                    <AgGridReact
                        ref={userGridRef}
                        onCellValueChanged={onValueChanged}
                        onGridReady={(event) => event.api.sizeColumnsToFit()}
                        // onRowDataUpdated={(event) => event.current.api.refreshCells()}
                        defaultColDef={defaultColDef}
                        rowData={rdUser}
                        columnDefs={userColDefs}>

                    </AgGridReact>
                </div>
                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px" }}><br /><h5><b></b></h5><br /></div>
                </div>

            </div>
        </>
    )

    return content

}

export default FrmUsersForm