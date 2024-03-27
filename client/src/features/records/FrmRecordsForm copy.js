import { useState, useEffect, useMemo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateRecordsMutation, useDeleteRecordMutation } from './recordsApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { Form } from 'react-bootstrap';
import { date2Weekday, dateForPicker } from "../../hooks/useDatePicker"
import useAuth from "../../hooks/useAuth"
import FrmRecordConsumable from './FrmRecordConsumable'

let eRecords = {}
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
const EditRecordForm = ({ res }) => {
    const { userid, username, status, isManager, isAdmin } = useAuth()
    const blankData = { "type": "", "details": "", "resourcesId": "", "description": "", "amount": 0, "_id": null, "userId": userid }
    let records = {}
    let activities = {}
    if (res) {
        if (res.records) {
            records = res.records
            if (records._id === 'new') { records.userId = userid }
        }
        if (res.activities) {
            activities = res.activities
        }
    }

    const formType = res.formType
    let msgContent = ''
    const msgRef = useRef();

    if (!records) {
        msgContent = 'New Record database'
        msgRef.className = 'resmsg'
        records = { blankData }
    } else {
        msgRef.className = 'offscreen'
        msgContent = ''
    }
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
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const recordGridRef = useRef();

    let data = Array.from(records).map((data, index) => ({
        "userId": data.userId._id,
        "activityId": data?.activityId?._id,
        "type": data.type,
        "details": data.details,
        "resourcesId": data.resourcesId,
        "description": data.description,
        "dateTime": dateForPicker(data.dateTime),
        "amount": data.amount ? parseFloat(data.amount) : 0,
        "_id": data._id
    }))

    const [rdRecord, setRdRecord] = useState(data)
    const [recordColDefs] = useState([
        { field: 'userId', headerName: 'user Id', width: 150, hide: true },
        { field: '_id', headerName: 'Id', width: 150 },
        { field: 'activityId', headerName: 'Activity Id', width: 150, editable: true },
        { field: "type", headerName: 'Type', width: 150, editable: true },
        { field: 'details', headerName: 'Details', width: 150, editable: true },
        { field: 'resourcesId', headerName: 'Resources Id', width: 150, editable: true },
        { field: "description", headerName: 'Description', width: 300, editable: true },
        { field: 'dateTime', headerName: 'Date', width: 150, editable: true },
        { field: "amount", headerName: 'Amount', width: 150, editable: true },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {

                    if (this.data._id) { delRecord(this.data._id, formType) }
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "record"
            },
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onSaveClicked = async (e) => {
        e.preventDefault()
        eRecords.data = rdRecord
        eRecords.formType = formType
        await updateRecords(eRecords)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                data = result.data.data.map((data, index) => ({
                    "userId": data.userId,
                    "activityId": data.activityId,
                    "type": data.type,
                    "details": data.details,
                    "resourcesId": data.resourcesId,
                    "description": data.description,
                    "dateTime": dateForPicker(data.dateTime),
                    "amount": data.amount ? parseFloat(data.amount) : 0,
                    "_id": data._id
                }))
                setRdRecord(data)
                recordGridRef.current.api.refreshCells()
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
                let rData = []
                recordGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdRecord(rData)
            }
            )
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdRecord))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdRecord ?
                [...rdRecord, blankData]
                : [blankData]
        setRdRecord(newRData)
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

    // useEffect(() => {
    //     console.log('useEffect-rowData: \n' + JSON.stringify(rdRecord))
    // })
    const newRecord = (
        <>
            <FrmRecordConsumable formType={formType} />
            <br />
        </>
    )

    const showRecords = (
        <>
            <div className="container grid_system" style={{ fontSize: '12px', borderTop: "1px solid blue", borderLeft: "1px solid blue", borderBottom: "1px solid blue", borderRight: "1px solid blue" }}>

                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px" }}><br /><h4><b>{formType} Records</b></h4></div>
                    {/* </div>


                <div className="row" > */}
                    <div className="form-group  ct-header__nav">
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
                    </div>
                    <div className="container-sm ag-theme-balham" style={{ height: 400, width: "100%", fontSize: '12px' }}>
                        <p ref={msgRef} className="" >{msgContent}</p>
                        <AgGridReact
                            ref={recordGridRef}
                            onCellValueChanged={onValueChanged}
                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                            // onRowDataUpdated={(event) => event.current.api.refreshCells()}
                            defaultColDef={defaultColDef}
                            rowData={rdRecord}
                            columnDefs={recordColDefs}>

                        </AgGridReact>
                    </div>
                    <div className="row">
                        <div className="col-sm-12" style={{ border: "0px" }}><br /><h5><b></b></h5><br /><br /></div>
                    </div>
                </div>
            </div>
        </>
    )
    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent.current}</p>

            {newRecord}
            {showRecords}

        </>
    )

    return content

}

export default EditRecordForm