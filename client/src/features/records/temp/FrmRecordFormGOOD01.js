import { useState, useEffect, useMemo, useRef, Component } from "react"
// import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateRecordsMutation, useDeleteRecordMutation } from '../recordsApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { Form } from 'react-bootstrap';
import { date2Weekday, dateForPicker } from "../../../hooks/useDatePicker"
import useAuth from "../../../hooks/useAuth"
import { useSelector } from 'react-redux'
import { selectActivity } from '../../../components/site/siteSlice'

let eRecords = {}
//let activities = {}
let detail_list = {}
const EditRecordForm = ({ res }) => {
    const activities = useSelector(selectActivity)
    const { userid, username, status, isManager, isAdmin } = useAuth()
    // const records = {
    //     "_id": "new",
    //     "employeeId": null,
    //     "type": null,
    //     "details": '',
    //     "job": null,
    //     "terminal": null,
    //     "activityId": '',
    //     "userId": userid,
    //     "amount": 0,
    //     "amtType": null,
    //     "dateTime": Date.now(),
    //     "description": null,
    //     "fileInfo": [],
    //     "formId": null,
    //     "posted": false,
    //     "unit": null
    // }
    //let records = {}

    const formType = res.formType
    if (res) {
        // if (res.records) {
        //     records = res.records
        //     if (records._id === 'new') { records.userId = userid }
        // }
        // if (res.activities) {
        //     activities = res.activities
        // }

        detail_list = (formType === 'Consumables')
            ? res.consumables
            : (formType === 'Equipment')
                ? res.equipment
                : (formType === 'Expenses')
                    ? res.expenses
                    : null

    }
    const typeRef = useRef();
    const actOptions = activities.map(activity => {
        return (
            <option
                key={activity._id}
                value={activity._id}
            > {activity.name}</option >
        )
    })
    const detailsOptions = detail_list.map(item => {
        return (
            <option
                key={item._id}
                value={item.name}
                itemType={item.type}
            > {item.name}</option >
        )
    })

    let msgContent = ''
    const msgRef = useRef();

    // if (!records) {
    //     msgContent = 'New Record database'
    //     msgRef.className = 'resmsg'
    //     records = { blankData }
    // } else {
    msgRef.className = 'offscreen'
    msgContent = ''
    // }
    const [updateRecords, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateRecordsMutation()
    const [deleteRecord, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteRecordMutation()
    const navigate = useNavigate()
    // const defaultColDef = useMemo(() => {
    //     return {
    //         flex: 1,
    //         resizable: true,
    //         width: 150,
    //     };
    // }, []);

    const [_id, set_id] = useState('new')
    const [employeeId, setEmployeeId] = useState(null)
    const [type, setType] = useState('')
    const [details, setDetails] = useState('')
    const [job, setJob] = useState(null)
    const [terminal, setTerminal] = useState(null)
    const [userId, setUserId] = useState(userid)
    const [amount, setAmount] = useState(0)
    const [amtType, setAmtType] = useState(null)
    const [dateTime, setDateTime] = useState(Date.now())
    const [description, setDescription] = useState(null)
    const [fileInfo, setFileInfo] = useState([])
    const [formId, sewtFormId] = useState(null)
    const [posted, setPosted] = useState(false)
    const [unit, setUnit] = useState(null)
    const [activityId, setActivityId] = useState('')


    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onActivityIdChanged = (e) => setActivityId(e.target.value)
    const onTypeChanged = (e) => setType(e.target.value)
    const onDetailsChanged = (e) => {
        setDetails(e.target.value)
        setType(e.target.options[e.target.options.selectedIndex].attributes.itemtype.value)
        typeRef.value = e.target.options[e.target.options.selectedIndex].attributes.itemtype.value
        console.log('details clicked: -- type prop :' + e.target.options[e.target.options.selectedIndex].attributes.itemtype.value)
    }
    const onDateTimeChanged = (e) => { setDateTime(e.target.value) }
    const onSaveClicked = async (e) => {
        e.preventDefault()
        //eRecords._id = !_id ? '' : _id
        eRecords.employeeId = !employeeId ? '' : employeeId
        eRecords.type = !type ? '' : type
        eRecords.details = !details ? '' : details
        eRecords.job = !job ? '' : job
        eRecords.terminal = !terminal ? '' : terminal
        eRecords.userId = !userId ? '' : userId
        eRecords.amount = !amount ? '' : amount
        eRecords.amtType = !amtType ? '' : amtType
        eRecords.dateTime = !dateTime ? '' : dateTime
        eRecords.description = !description ? '' : description
        eRecords.fileInfo = !fileInfo ? '' : fileInfo
        eRecords.formId = !formId ? '' : formId
        eRecords.posted = !posted ? '' : posted
        eRecords.unit = !unit ? '' : unit
        eRecords.formType = formType
        await updateRecords(eRecords)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                // data = result.data.data.map((data, index) => ({
                //     "userId": data.userId,
                //     "activityId": data.activityId,
                //     "type": data.type,
                //     "details": data.details,
                //     "description": data.description,
                //     "dateTime": dateForPicker(data.dateTime),
                //     "amount": data.amount ? parseFloat(data.amount) : 0,
                //     "_id": data._id
                // }))
                //setRdRecord(data)
                //recordGridRef.current.api.refreshCells()
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                msgRef.className = "offscreen"
            })
    }

    const delRecord = async (_id, formType) => {
        await deleteRecord({ id: _id, formType: formType })
            .then((result) => {


            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                //let rData = []
                //recordGridRef.current.api.forEachNode(node => rData.push(node.data));
                //setRdRecord(rData)
            }
            )
    }

    const onNewClicked = (e) => {
        e.preventDefault()
    }
    const errRef = useRef();
    useEffect(() => {
        errRef.className = "resmsg"
        isSuccess ? errContent.current = " Saved!"
            : errContent.current = "Deleted!"
    }, [isSuccess, isDelSuccess, navigate])


    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent.current}</p>

            <div className="container grid_system" style={{ fontSize: '12px', borderTop: "1px solid blue", borderLeft: "1px solid blue", borderBottom: "1px solid blue", borderRight: "1px solid blue" }}>

                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px" }}><h4><b>New {formType} Records</b></h4></div>
                </div>

                <div className="form-group row" >
                    <div className="col-sm-2" style={{ border: "0px" }}><b>Activity Name: </b></div>
                    <div className="col-sm-4" style={{ border: "0px" }}>
                        <select
                            id="activity"
                            name="activity"
                            style={{ fontSize: '11px' }}
                            className="form-select form-select-sm"
                            value={activityId}
                            onChange={onActivityIdChanged}
                        >
                            {actOptions}
                        </select>
                    </div>
                    <div className="col-sm-1" style={{ border: "0px" }}><b>Date: </b></div>
                    <div className="col-sm-4" style={{ border: "0px" }}>
                        <Form.Group controlId="dateTime">
                            <Form.Control
                                type="date"
                                style={{ fontSize: '11px' }}
                                value={dateTime ? dateForPicker(dateTime) : ''}
                                placeholder={dateTime ? dateForPicker(dateTime) : "dd-mm-yyyy"}
                                onChange={onDateTimeChanged}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-sm-1" style={{ border: "0px", paddingRight: '25px' }}>
                        <div className="form-group  ct-header__nav">
                            <button
                                className="btn btn-primary btn-sm"
                                title="New"
                                onClick={onNewClicked}
                            >
                                <FontAwesomeIcon icon={faPlusSquare} />
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                title="Save"
                                onClick={onSaveClicked}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="form-group row" >
                    <div className="col-sm-2" style={{ border: "0px" }}><b>Details </b></div>
                    <div className="col-sm-4" style={{ border: "0px" }}>
                        <select
                            id="details"
                            name="details"
                            style={{ fontSize: '11px' }}
                            className="form-select form-select-sm"
                            value={details}
                            onChange={onDetailsChanged}
                        >
                            {detailsOptions}
                        </select>
                    </div>
                    <div className="col-sm-1" style={{ border: "0px" }}><b>Type: </b></div>
                    <div className="col-sm-4" style={{ border: "0px" }}>
                        <input
                            className="form-control"
                            id="type"
                            name="type"
                            type="text"
                            style={{ fontSize: '11px' }}
                            ref={typeRef}
                            placeholder="Type"
                            autoComplete="off"
                            value={type}
                            onChange={onTypeChanged}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px" }}><br /><h5><b></b></h5><br /><br /></div>
                </div>
            </div>
        </>
    )
    return content
}
export default EditRecordForm