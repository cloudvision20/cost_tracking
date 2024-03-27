import { useState, useEffect, useMemo, useRef, Component } from "react"
// import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateRecordsMutation, useDeleteRecordMutation } from './recordsApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { Form } from 'react-bootstrap';
import { date2Weekday, dateForPicker } from "../../hooks/useDatePicker"
import useAuth from "../../hooks/useAuth"
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'

let eRecords = {}
//let activities = {}
let detail_list = {}
const EditRecordForm = ({ res, formType }) => {
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

    if (res) { detail_list = res.masters }
    const typeRef = useRef();
    const amtTypeRef = useRef();
    let actOptions = activities.activities.map(activity => {
        console.log(JSON.stringify(activity))
        return (
            <option
                key={activity._id}
                value={activity._id}
            > {activity.name}</option >
        )
    })
    let detailsOptions = detail_list.map(item => {
        return (
            <option
                key={item._id}
                value={item.name}
                itemType={item.type}
                itemUnit={item.unit}
                resourceId={item._id}
            > {item.name}</option >
        )
    })

    let uniqueUnit = [];
    let unitOptions = detail_list.map((item) => {
        var findItem = uniqueUnit.find((x) => x.unit === item.unit);
        if (!findItem) {
            uniqueUnit.push(item)
            return (
                <option
                    key={item._id}
                    value={item.unit}
                > {item.unit}</option >
            )
        }
    });
    // console.log('unitOptions =' + JSON.stringify(unitOptions))
    let msgContent = ''
    const msgRef = useRef();
    msgRef.className = 'offscreen'
    msgContent = ''

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

    const [_id, set_id] = useState('new')
    const [employeeId, setEmployeeId] = useState(null)
    const [type, setType] = useState('')
    const [details, setDetails] = useState('')
    const [resourceId, setResourceId] = useState('')
    const [job, setJob] = useState(null)
    const [terminal, setTerminal] = useState(null)
    const [userId, setUserId] = useState(userid)
    const [activityId, setActivityId] = useState('')
    const [amount, setAmount] = useState(0)
    const [amtType, setAmtType] = useState(null)
    const [dateTime, setDateTime] = useState(Date.now())
    const [description, setDescription] = useState(null)
    const [fileInfo, setFileInfo] = useState([])
    const [formId, setFormId] = useState(null)
    const [posted, setPosted] = useState(false)
    const [unit, setUnit] = useState('')



    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onActivityIdChanged = (e) => setActivityId(e.target.value)
    const onTypeChanged = (e) => setType(e.target.value)
    const onAmountChanged = (e) => setAmount(e.target.value)
    const onDescriptionChanged = (e) => setDescription(e.target.value)
    const onDetailsChanged = (e) => {
        setDetails(e.target.value)
        setType(e.target.options[e.target.options.selectedIndex].attributes.itemType.value)
        setUnit(e.target.options[e.target.options.selectedIndex].attributes.itemUnit.value)
        setResourceId(e.target.options[e.target.options.selectedIndex].attributes.resourceId.value)
        typeRef.value = e.target.options[e.target.options.selectedIndex].attributes.itemtype.value
        console.log('details clicked: -- type prop :' + e.target.options[e.target.options.selectedIndex].attributes.itemtype.value)
    }
    const onDateTimeChanged = (e) => { setDateTime(e.target.value) }
    const onSaveClicked = async (e) => {
        e.preventDefault()
        let dataRecords = {}

        if (_id) {
            if (_id !== '' && _id !== 'new') {
                dataRecords._id = _id
            }
        }
        dataRecords.employeeId = !employeeId ? '' : employeeId
        dataRecords.type = !type ? '' : type
        dataRecords.details = !details ? '' : details
        dataRecords.resourceId = !resourceId ? '' : resourceId
        dataRecords.job = !job ? '' : job
        dataRecords.terminal = !terminal ? '' : terminal
        dataRecords.userId = !userId ? '' : userId
        dataRecords.activityId = !activityId ? '' : activityId

        dataRecords.amount = !amount ? '' : parseFloat(amount)
        dataRecords.amtType = !amtType ? '' : amtType
        dataRecords.dateTime = !dateTime ? '' : dateTime
        dataRecords.description = !description ? '' : description

        dataRecords.fileInfo = !fileInfo ? [] : fileInfo
        dataRecords.formId = !formId ? '' : formId
        dataRecords.posted = !posted ? '' : posted

        dataRecords.unit = !unit ? '' : unit

        eRecords.data = [dataRecords]
        eRecords.formType = formType
        await updateRecords(eRecords)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                const data = result.data.data.map((dt, index) => ({
                    "_id": dt._id,
                    "employeeId": dt.employeeId,
                    "type": dt.type,
                    "details": dt.details,
                    "resourceId": dt.resourceId,
                    "job": dt.job,
                    "terminal": dt.terminal,
                    "userId": dt.userId,
                    "activityId": dt.activityId,
                    "amount": dt.amount,
                    "amtType": dt.amtType,
                    "dateTime": dt.dateTime,
                    "description": dt.description,
                    "fileInfo": dt.fileInfo,
                    "formId": dt.formId,
                    "posted": dt.posted,
                    "unit": dt.unit
                }))

                if (data?.length > 0) {

                    set_id(data[0]._id)
                    setEmployeeId(data[0].employeeId)
                    setType(data[0].type)
                    setDetails(data[0].details)
                    setResourceId(data[0].resourceId)
                    setJob(data[0].job)
                    setTerminal(data[0].terminal)
                    setUserId(data[0].userId)
                    setActivityId(data[0].activityId)

                    setAmount(data[0].amount)
                    setAmtType(data[0].amtType)
                    setDateTime(data[0].dateTime)
                    setDescription(data[0].description)

                    setFileInfo(data[0].fileInfo)
                    setFormId(data[0].formId)
                    setPosted(data[0].posted)

                    setUnit(data[0].unit)

                }
                errClass = "resmsg"
                errRef.className = "resmsg"
                errContent.current = " Saved!"
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                //msgRef.className = "offscreen"
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
            })
    }

    const onNewClicked = (e) => {
        e.preventDefault()
        set_id('new')
        setEmployeeId(null)
        setType('')
        setDetails('')
        setResourceId('')
        setJob(null)
        setTerminal(null)
        setUserId(userId)
        setActivityId(activityId)

        setAmount(0)
        setAmtType(null)
        setDateTime(Date.now())
        setDescription('')

        setFileInfo([])
        setFormId(null)
        setPosted(false)

        setUnit('')
    }
    const errRef = useRef();
    useEffect(() => {
        // errRef.className = "resmsg"
        // isSuccess ? errContent.current = " Saved!"
        //     : isDelSuccess ? errContent.current = " Deleted!"
        //         : errContent.current = ""
        if (isSuccess) (window.alert(" Saved!"))
        if (isDelSuccess) (window.alert(" Deleted!"))
    }, [isSuccess, isDelSuccess, navigate])
    useEffect(() => {
        setDetails(res.masters[0].name)
        setType(res.masters[0].type)
        setUnit(res.masters[0].unit)
    }, [res.masters])
    useEffect(() => {
        setActivityId(activities.current.activityId)
    }, [activities])
    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent.current}</p>
            <div className="container grid_system" style={{ fontSize: '12px', paddingRight: '25px', borderTop: "1px solid blue", borderLeft: "1px solid blue", borderBottom: "1px solid blue", borderRight: "1px solid blue" }}>

                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px", paddingBottom: '5px', }}><h4><b>New {formType} Records</b></h4></div>
                </div>
                <div className="col-sm-12" style={{ border: "0px" }}>
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
                    <div className="col-sm-2" style={{ border: "0px" }}><b>Date: </b></div>
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

                </div>
                <div className="form-group row" >
                    <div className="col-sm-2" style={{ border: "0px" }}><b>ResourceDetails </b></div>
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
                    <div className="col-sm-2" style={{ border: "0px" }}><b>Type: </b></div>
                    <div className="col-sm-4" style={{ border: "0px" }}>
                        <input
                            className="form-control"
                            id="type"
                            name="type"
                            type="text"
                            style={{ fontSize: '11px' }}
                            ref={typeRef}
                            autoComplete="off"
                            value={type}
                            readonly
                        />
                    </div>
                </div>
                <div className="form-group row" >
                    <div className="col-sm-2" style={{ border: "0px" }}><b>Amount: </b></div>
                    <div className="col-sm-4" style={{ border: "0px" }}>
                        <input
                            className="form-control"
                            id="amount" name="amount"
                            type="text"
                            style={{ fontSize: '11px' }}
                            placeholder="Amount"
                            autoComplete="off"
                            value={amount}
                            onChange={onAmountChanged}
                        />
                    </div>
                    <div className="col-sm-2" style={{ border: "0px" }}><b>Unit: </b></div>
                    <div className="col-sm-4" style={{ border: "0px" }}>
                        <select
                            id="unit" name="unit"
                            style={{ fontSize: '11px' }}
                            className="form-select form-select-sm"
                            value={unit}
                            onChange={onDetailsChanged}
                        >
                            {unitOptions}
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2" style={{ border: "0px" }}><b>Description: </b></div>
                    <div className="col-sm-10" style={{ padding: "0px", border: "0px" }}>
                        <textarea
                            className="form-control"
                            id="description" name="description"
                            style={{ fontSize: '11px' }}
                            rows="2"
                            value={description}
                            onChange={onDescriptionChanged} />
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