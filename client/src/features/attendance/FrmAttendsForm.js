import { useState, useEffect, useMemo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateAttendsMutation, useDeleteAttendMutation } from './attendsApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { Form } from 'react-bootstrap';
import { date2Weekday, dateForPicker } from "../../hooks/useDatePicker"
import useAuth from "../../hooks/useAuth"

let eAttends = {}
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
const FrmAttendForm = ({ res }) => {
    const { userid, username, status, isManager, isAdmin } = useAuth()
    const blankData = { "type": "", "details": "", "description": "", "amount": 0, "_id": null, "userId": userid }
    let attends = {}
    let activities = {}
    if (res) {
        if (res.attends) {
            attends = res.attends
            if (attends._id === 'new') { attends.userId = userid }
        }
        if (res.activities) {
            activities = res.activities
        }
    }

    let msgContent = ''
    const msgRef = useRef();

    if (!attends) {
        msgContent = 'New Attend database'
        msgRef.className = 'resmsg'
        attends = { blankData }
    } else {
        msgRef.className = 'offscreen'
        msgContent = ''
    }
    const [updateAttends, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateAttendsMutation()
    const [deleteAttend, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteAttendMutation()
    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const attendGridRef = useRef();

    let data = Array.from(attends).map((data, index) => ({
        "userId": data.userId._id,
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

    const [rdAttend, setRdAttend] = useState(data)
    const [attendColDefs] = useState([
        { field: 'userId', headerName: 'user Id', width: 150, hide: true },
        { field: '_id', headerName: 'Id', width: 150 },

        { field: "activityId", headerName: 'Activity Id', width: 150, editable: true },
        { field: 'employeeId', headerName: 'Employee Id', width: 150, editable: true },
        { field: "employeeName", headerName: 'employeeName', width: 300, editable: true },
        { field: "clockType", headerName: 'clockType', width: 150, editable: true },
        { field: 'date', headerName: 'Date', width: 150, editable: true },

        { field: "time", headerName: 'Time', width: 150, editable: true },
        { field: 'weekday', headerName: 'Weekday', width: 150, editable: true },
        { field: "description", headerName: 'Description', width: 300, editable: true },
        { field: 'datetime', headerName: 'Date Time', width: 150, editable: true },
        { field: "terminal", headerName: 'Terminal', width: 150, editable: true },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {

                    if (this.data._id) { delAttend(this.data._id) }
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "attend"
            },
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onSaveClicked = async (e) => {
        e.preventDefault()
        eAttends.data = rdAttend
        await updateAttends(eAttends)
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
                setRdAttend(data)
                attendGridRef.current.api.refreshCells()
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                msgRef.className = "offscreen"
            })
    }

    const delAttend = async (_id) => {
        await deleteAttend({ id: _id })
            .then((result) => {


            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                let rData = []
                attendGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdAttend(rData)
            }
            )
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdAttend))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdAttend ?
                [...rdAttend, blankData]
                : [blankData]
        setRdAttend(newRData)
    }
    const errRef = useRef();
    useEffect(() => {
        errRef.className = "resmsg"
        isSuccess ? errContent.current = " Saved!"
            : errContent.current = "Deleted!"
    }, [isSuccess, isDelSuccess, navigate])

    // useEffect(() => {
    //     console.log('useEffect-rowData: \n' + JSON.stringify(rdAttend))
    // })
    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent.current}</p>


            <div className="container grid_system" style={{ fontSize: '12px', borderTop: "1px solid blue", borderLeft: "1px solid blue", borderBottom: "1px solid blue", borderRight: "1px solid blue" }}>

                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px" }}><br /><h4><b>View Attendance Records</b></h4></div>
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
                <div className="container-sm ag-theme-balham" style={{ overflow: 'hidden', height: "600px", width: "100%", fontSize: '12px' }}>
                    <p ref={msgRef} className="" >{msgContent}</p>
                    <AgGridReact
                        ref={attendGridRef}
                        onCellValueChanged={onValueChanged}
                        onGridReady={(event) => event.api.sizeColumnsToFit()}
                        // onRowDataUpdated={(event) => event.current.api.refreshCells()}
                        defaultColDef={defaultColDef}
                        rowData={rdAttend}
                        columnDefs={attendColDefs}>

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

export default FrmAttendForm