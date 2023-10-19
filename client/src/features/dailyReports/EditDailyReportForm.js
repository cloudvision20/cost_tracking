import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useUpdateDailyReportMutation, useDeleteDailyReportMutation } from "./dailyReportsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import { Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import AttendancesUpload from '../files/AttendancesUpload'
import { date2Weekday, dateForPicker } from "../../hooks/useDatePicker"
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";

class BtnCellRenderer extends Component {
    constructor(props, Id) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
        this.btnDelClickedHandler = this.btnDelClickedHandler.bind(this);
    }
    btnClickedHandler() { this.props.clicked(this.props.value); }
    btnDelClickedHandler(e) { this.props.delClicked(this.props); }
    render() {
        return (
            <div className="form-group ct-header__nav">
                <button className="btn btn-danger btn-xs" style={{ fontSize: "8px" }} onClick={this.btnDelClickedHandler}>Del</button>
            </div>
        )
    }
}

const EditDailyReportForm = ({ res }) => {
    const dailyReport = res.dailyReport[0]
    const users = res.users
    const { userid, isManager, isAdmin } = useAuth()
    if (dailyReport._id === 'new') { dailyReport.userId = userid }

    const [updateDailyReport, { isLoading, isSuccess, isError, error }] = useUpdateDailyReportMutation()
    const [deleteDailyReport, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteDailyReportMutation()

    const navigate = useNavigate()

    const defaultColDef = useMemo(() => {
        return { flex: 1, resizable: true, editable: true, };
    }, []);

    const data = Array.from(dailyReport.manHour.loading).map((loading) => ({
        "indirect": loading.indirect,
        "indirectPax": loading.indirectPax,
        "direct": loading.direct,
        "directPax": loading.directPax,
        "direct1": loading.direct1,
        "directPax1": loading.directPax1,
        "owner": loading.owner,
        "ownerPax": loading.ownerPax,
        "rowId": Date.now().toString(36),
        "isDirty": false
    }))

    const [columnDefs] = useState([
        { field: "indirect", headerName: "Indirect (HNEH)", editable: true },
        { field: "indirectPax", width: 100, headerName: "PAX", editable: true },
        { field: "direct", headerName: "Direct (HNEH)", editable: true },
        { field: "directPax", width: 100, headerName: "PAX", editable: true },
        { field: "direct1", headerName: "Direct (HNEH)", editable: true },
        { field: "directPax1", width: 100, headerName: "PAX", editable: true },
        { field: "owner", headerName: "Owner", editable: true },
        { field: "ownerPax", width: 100, headerName: "PAX", editable: true },
        {
            headerName: 'Actions',
            editable: false,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                //clicked: function (field) { },
                delClicked: function () { this.api.applyTransaction({ remove: [this.data] }); },
                Id: "loading"
            },
        }
    ])
    const newLoadingClicked = (e) => {
        let newRowData = [...rowData, {
            "indirect": null,
            "indirectPax": null,
            "direct": null,
            "directPax": null,
            "direct1": null,
            "directPax1": null,
            "owner": null,
            "ownerPax": null,
            "rowId": Date.now().toString(36),
            "isDirty": false
        }]
        setRowData(newRowData)
    }
    const loadingGridRef = useRef();
    const [rowData, setRowData] = useState(data)
    const meData = Array.from(dailyReport.meLoading).map((meLoading) => ({
        "load1": meLoading.load1,
        "pax1": meLoading.pax1,
        "load2": meLoading.load2,
        "pax2": meLoading.pax2,
        "load3": meLoading.load3,
        "pax3": meLoading.pax3,
        "load4": meLoading.load4,
        "pax4": meLoading.pax4,
        "load5": meLoading.load5,
        "pax5": meLoading.pax5,
        "rowId": Date.now().toString(36),
        "isDirty": false
    }))
    const [meColumnDefs] = useState([
        { field: "load1", headerName: "Loading", editable: true },
        { field: "pax1", width: 100, headerName: "PAX", editable: true },
        { field: "load2", headerName: "Loading", editable: true },
        { field: "pax2", width: 100, headerName: "PAX", editable: true },
        { field: "load3", headerName: "Loading", editable: true },
        { field: "pax3", width: 100, headerName: "PAX", editable: true },
        { field: "load4", headerName: "Loading", editable: true },
        { field: "pax4", width: 100, headerName: "PAX", editable: true },
        { field: "load5", headerName: "Loading", editable: true },
        { field: "pax5", width: 100, headerName: "PAX", editable: true },
        {
            headerName: 'Actions',
            editable: false,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                //clicked: function (field) { },
                delClicked: function () { this.api.applyTransaction({ remove: [this.data] }); },
                Id: "meloading"
            },
        }
    ])

    const newRowMELoadingClicked = (e) => {
        let newRdMELoading = [...rdMELoading, {
            "load1": null,
            "pax1": null,
            "load2": null,
            "pax2": null,
            "load3": null,
            "pax3": null,
            "load4": null,
            "pax4": null,
            "load5": null,
            "pax5": null,
            "rowId": Date.now().toString(36),
            "isDirty": false
        }]
        setRdMELoading(newRdMELoading)
    }
    const meLoadingGridRef = useRef();
    const [rdMELoading, setRdMELoading] = useState(meData)
    const [title, setTitle] = useState(dailyReport.title)
    const [text, setText] = useState(dailyReport.text)
    const [reportDate, setReportDate] = useState(dailyReport.reportDate)
    const [reportDay, setReportDay] = useState(dailyReport.reportDay)

    const [indirectPrev, setIndirectPrev] = useState(dailyReport.manHour.indirectPrev)
    const [indirectTdy, setIndirectTdy] = useState(dailyReport.manHour.indirectTdy)
    const [indirectCumm, setIndirectCumm] = useState(dailyReport.manHour.indirectCumm)
    const [directPrev, setDirectPrev] = useState(dailyReport.manHour.directPrev)
    const [directTdy, setDirectTdy] = useState(dailyReport.manHour.directTdy)
    const [directCumm, setDirectCumm] = useState(dailyReport.manHour.directCumm)

    const [raining, setRaining] = useState(dailyReport.weatherChart.raining)
    const [driziling, setDriziling] = useState(dailyReport.weatherChart.driziling)
    const [sunny, setSunny] = useState(dailyReport.weatherChart.sunny)

    const [indirectTtl, setIndirectTtl] = useState(dailyReport.manHour.indirectTtl)
    const [directTtl, setDirectTtl] = useState(dailyReport.manHour.directTtl)
    const [directTtl1, setDirectTtl1] = useState(dailyReport.manHour.directTtl1)
    const [ownerTtl, setOwnerTtl] = useState(dailyReport.manHour.ownerTtl)
    const [pcSarawakians, setPcSarawakians] = useState(dailyReport.manHour.pcSarawakians)
    const [pcNonSarawakians, setPcNonSarawakians] = useState(dailyReport.manHour.pcNonSarawakians)

    const [meLoadingTtl, setMeLoadingTtl] = useState(dailyReport.meLoadingTtl)
    // Safety Toolbox
    const [safetyTbItem, setSafetyTbItem] = useState(dailyReport.safetyTbItem)
    const [safetyTbDesp, setSafetyTbDesp] = useState(dailyReport.safetyTbDesp)
    //Downtime
    const [downTimeItem, setDownTimeItem] = useState(dailyReport.downTimeItem)
    const [downTimeDesp, setDownTimeDesp] = useState(dailyReport.downTimeDesp)
    //Construction Progress
    const [conProgressItem, setConProgressItem] = useState(dailyReport.conProgressItem)
    const [conProgressDesp, setConProgressDesp] = useState(dailyReport.conProgressDesp)
    const [conProgressStatus, setConProgressStatus] = useState(dailyReport.conProgressStatus)
    //Next Day Work Plan
    const [nextDayWPItem, setNextDayWPItem] = useState(dailyReport.nextDayWPItem)
    const [nextDayWPDesp, setNextDayWPDesp] = useState(dailyReport.nextDayWPDesp)
    const [nextDayWPRemarks, setNextDayWPRemarks] = useState(dailyReport.nextDayWPRemarks)
    //Project Material
    const [prjMaterialItem, setPrjMaterialItem] = useState(dailyReport.prjMaterialItem)
    const [prjMaterialDocNo, setPrjMaterialDocNo] = useState(dailyReport.prjMaterialDocNo) //PO ,DO number
    const [prjMaterialQty, setPrjMaterialQty] = useState(dailyReport.prjMaterialQty)
    const [prjMaterialStatus, setPrjMaterialStatus] = useState(dailyReport.prjMaterialStatus) // status and remarks
    //Area Of Concern
    const [aocItem, setAocItem] = useState(dailyReport.aocItem)
    const [aocDesp, setAocDesp] = useState(dailyReport.aocDesp)
    const [aocRemedialPlan, setAocRemedialPlan] = useState(dailyReport.aocRemedialPlan)
    const [aocStatus, setAocStatus] = useState(dailyReport.aocStatus) // status and remarks
    const [aocDtResolved, setAocDtResolved] = useState(dailyReport.aocDtResolved)
    //site Tech Query
    const [siteTechQItem, setSiteTechQItem] = useState(dailyReport.siteTechQItem)
    const [siteTechQIDesp, setSiteTechQIDesp] = useState(dailyReport.siteTechQIDesp)
    const [siteTechQIDtRaised, setSiteTechQIDtRaised] = useState(dailyReport.siteTechQIDtRaised)
    const [siteTechQIDtResolved, setSiteTechQIDtResolved] = useState(dailyReport.siteTechQIDtResolved)

    const [preparedBy, setPreparedBy] = useState(dailyReport.preparedBy)
    const [verifiedBy, setVerifiedBy] = useState(dailyReport.verifiedBy)
    const [acknowledgedBy, setAcknowledgedBy] = useState(dailyReport.acknowledgedBy)
    const [completed, setCompleted] = useState(dailyReport.completed)
    const [userId, setUserId] = useState(dailyReport.userId)

    useEffect(() => {
        setReportDay(date2Weekday(reportDate))
    }, [reportDate])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            setReportDate('')
            setReportDay('')
            navigate(-1)
        }
    }, [isSuccess, isDelSuccess, navigate])

    // const onTitleChanged = e => setTitle(e.target.value)
    // const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onReportDateChanged = (e) => setReportDate(e.target.value)
    const onTextChanged = (e, type) => {
        switch (type) {
            case 'indirectPrev': return setIndirectPrev(e.target.value)
            case 'indirectTdy': return setIndirectTdy(e.target.value)
            case 'indirectCumm': return setIndirectCumm(e.target.value)
            case 'directPrev': return setDirectPrev(e.target.value)
            case 'directTdy': return setDirectTdy(e.target.value)
            case 'directCumm': return setDirectCumm(e.target.value)
            case 'raining': return setRaining(e.target.value)
            case 'driziling': return setDriziling(e.target.value)
            case 'sunny': return setSunny(e.target.value)
            case 'indirectTtl': return setIndirectTtl(e.target.value)
            case 'directTtl': return setDirectTtl(e.target.value)
            case 'directTtl1': return setDirectTtl1(e.target.value)
            case 'ownerTtl': return setOwnerTtl(e.target.value)
            case 'pcSarawakians': return setPcSarawakians(e.target.value)
            case 'pcNonSarawakians': return setPcNonSarawakians(e.target.value)
            //Safety Toolbox
            case 'safetyTbItem': return setSafetyTbItem(e.target.value)
            case 'safetyTbDesp': return setSafetyTbDesp(e.target.value)
            //Downtime
            case 'downTimeItem': return setDownTimeItem(e.target.value)
            case 'downTimeDesp': return setDownTimeDesp(e.target.value)
            //Construction Progress
            case 'conProgressItem': return setConProgressItem(e.target.value)
            case 'conProgressDesp': return setConProgressDesp(e.target.value)
            case 'conProgressStatus': return setConProgressStatus(e.target.value)
            //Next Day Work Plan
            case 'nextDayWPItem': return setNextDayWPItem(e.target.value)
            case 'nextDayWPDesp': return setNextDayWPDesp(e.target.value)
            case 'nextDayWPRemarks': return setNextDayWPRemarks(e.target.value)
            //Project Material
            case 'prjMaterialItem': return setPrjMaterialItem(e.target.value)
            case 'prjMaterialDocNo': return setPrjMaterialDocNo(e.target.value) //PO ,DO number
            case 'prjMaterialQty': return setPrjMaterialQty(e.target.value)
            case 'prjMaterialStatus': return setPrjMaterialStatus(e.target.value) // status and remarks
            //Area Of Concern
            case 'aocItem': return setAocItem(e.target.value)
            case 'aocDesp': return setAocDesp(e.target.value)
            case 'aocRemedialPlan': return setAocRemedialPlan(e.target.value)
            case 'aocStatus': return setAocStatus(e.target.value) // status and remarks
            case 'aocDtResolved': return setAocDtResolved(e.target.value)
            //site Tech Query
            case 'siteTechQItem': return setSiteTechQItem(e.target.value)
            case 'siteTechQIDesp': return setSiteTechQIDesp(e.target.value)
            case 'siteTechQIDtRaised': return setSiteTechQIDtRaised(e.target.value)
            case 'siteTechQIDtResolved': return setSiteTechQIDtResolved(e.target.value)

            case 'preparedBy': return setPreparedBy(e.target.value)
            case 'verifiedBy': return setVerifiedBy(e.target.value)
            case 'acknowledgedBy': return setAcknowledgedBy(e.target.value)
            default:
                return setText(e.target.value)
        }
    }

    const onCellValueChanged = (e) => {
        //console.log('newLoadingClicked-rowData:' + JSON.stringify(rowData))
        if (e.data.indirect || e.data.indirectPax || e.data.direct || e.data.directPax || e.data.direct1 || e.data.directPax1 || e.data.owner || e.data.ownerPax) {
            e.data.isDirty = true
            if (e.rowIndex === (rowData.length - 1)) { newLoadingClicked(e) }
        } else { e.data.isDirty = false }
    }

    const onMECellValueChanged = (e) => {
        //console.log('newRowMELoadingClicked-rowData:' + JSON.stringify(rowData))
        if (e.data.load1 || e.data.pax1 || e.data.load2 || e.data.pax2 || e.data.load3 || e.data.pax3 || e.data.load4 || e.data.pax4 || e.data.load5 || e.data.pax5) {
            e.data.isDirty = true
            if (e.rowIndex === (rdMELoading.length - 1)) { newRowMELoadingClicked(e) }
        } else { e.data.isDirty = false }
    }

    const canSave = [userId].every(Boolean) && !isLoading

    const onSaveDailyReportClicked = async (e) => {
        e.preventDefault()
        let eDailyReport = {}
        let weatherChart = {}
        let manHour = {}
        if (canSave) {
            if (dailyReport.activityId) { eDailyReport.activityId = dailyReport.activityId }
            if (dailyReport._id !== 'new') eDailyReport._id = dailyReport._id
            eDailyReport.id = dailyReport.id
            eDailyReport.userId = userId
            eDailyReport.title = title
            eDailyReport.text = text
            eDailyReport.reportDate = reportDate
            eDailyReport.reportDay = reportDay

            manHour.indirectPrev = indirectPrev
            manHour.indirectTdy = indirectTdy
            manHour.indirectCumm = indirectCumm
            manHour.directPrev = directPrev
            manHour.directTdy = directTdy
            manHour.directCumm = directCumm

            let rData = []
            loadingGridRef.current.api.forEachNode(node => rData.push(node.data));
            manHour.loading = rData.filter(rd => { return (rd.indirect || rd.indirectPax || rd.direct || rd.directPax || rd.direct1 || rd.directPax1 || rd.owner || rd.ownerPax) });

            manHour.indirectTtl = indirectTtl
            manHour.directTtl = directTtl
            manHour.directTtl1 = directTtl1
            manHour.ownerTtl = ownerTtl
            manHour.pcSarawakians = pcSarawakians
            manHour.pcNonSarawakians = pcNonSarawakians
            eDailyReport.manHour = manHour

            //weatherChart.legend = legend
            weatherChart.raining = raining
            weatherChart.driziling = driziling
            weatherChart.sunny = sunny
            eDailyReport.weatherChart = weatherChart

            rData = []
            meLoadingGridRef.current.api.forEachNode(node => rData.push(node.data));
            eDailyReport.meLoading = rData.filter(rd => { return (rd.load1 || rd.pax1 || rd.load2 || rd.pax2 || rd.load3 || rd.pax3 || rd.load4 || rd.pax4 || rd.load5 || rd.pax5) })

            eDailyReport.meLoadingTtl = meLoadingTtl

            //safetyToolbox
            eDailyReport.safetyTbItem = !safetyTbItem ? '' : safetyTbItem
            eDailyReport.safetyTbDesp = !safetyTbDesp ? '' : safetyTbDesp
            //downTime
            eDailyReport.downTimeItem = !downTimeItem ? '' : downTimeItem
            eDailyReport.downTimeDesp = !downTimeDesp ? '' : downTimeDesp
            //constructionProgress
            eDailyReport.conProgressItem = !conProgressItem ? '' : conProgressItem
            eDailyReport.conProgressDesp = !conProgressDesp ? '' : conProgressDesp
            eDailyReport.conProgressStatus = !conProgressStatus ? '' : conProgressStatus
            //nextDayWorkPlan
            eDailyReport.nextDayWPItem = !nextDayWPItem ? '' : nextDayWPItem
            eDailyReport.nextDayWPDesp = !nextDayWPDesp ? '' : nextDayWPDesp
            eDailyReport.nextDayWPRemarks = !nextDayWPRemarks ? '' : nextDayWPRemarks
            //projectMaterial
            eDailyReport.prjMaterialItem = !prjMaterialItem ? '' : prjMaterialItem
            eDailyReport.prjMaterialDocNo = !prjMaterialDocNo ? '' : prjMaterialDocNo   //PO ,DO number
            eDailyReport.prjMaterialQty = !prjMaterialQty ? 0 : parseFloat(prjMaterialQty)
            eDailyReport.prjMaterialStatus = !prjMaterialStatus ? '' : prjMaterialStatus // status and remarks
            //areaOfConcern
            eDailyReport.aocItem = !aocItem ? '' : aocItem
            eDailyReport.aocDesp = !aocDesp ? '' : aocDesp  //PO ,DO number
            eDailyReport.aocRemedialPlan = !aocRemedialPlan ? '' : aocRemedialPlan
            eDailyReport.aocStatus = !aocStatus ? '' : aocStatus // status and remarks
            eDailyReport.aocDtResolved = !aocDtResolved ? '' : aocDtResolved
            //site Tech Query
            eDailyReport.siteTechQItem = !siteTechQItem ? '' : siteTechQItem
            eDailyReport.siteTechQIDesp = !siteTechQIDesp ? '' : siteTechQIDesp //PO ,DO number
            eDailyReport.siteTechQIDtRaised = !siteTechQIDtRaised ? '' : siteTechQIDtRaised
            eDailyReport.siteTechQIDtResolved = !siteTechQIDtResolved ? '' : siteTechQIDtResolved
            eDailyReport.acknowledgedBy = acknowledgedBy
            eDailyReport.verifiedBy = verifiedBy //PO ,DO number
            eDailyReport.preparedBy = preparedBy
            eDailyReport.completed = completed

            // console.log(eDailyReport); console.log(JSON.stringify(eDailyReport))
            await updateDailyReport(eDailyReport)
        }
    }

    const onDeleteDailyReportClicked = async (e) => {
        e.preventDefault()
        await deleteDailyReport({ id: dailyReport._id })
    }

    const created = new Date(dailyReport.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(dailyReport.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => { return (<option key={user._id} value={user._id} >{user.username} </option >) })
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    let deleteButton = null
    if (isManager || isAdmin) { deleteButton = (<button className="btn btn-danger" title="Delete" onClick={onDeleteDailyReportClicked}><FontAwesomeIcon icon={faTrashCan} /></button>) }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <form onSubmit={e => e.preventDefault()}>
                <div className="panel">
                    <h5><b>Edit DailyReport for date: {dateForPicker(reportDate)}</b></h5>
                    <div className="form-group ct-header__nav">
                        <button className="btn btn-primary" title="Save" onClick={onSaveDailyReportClicked} disabled={!canSave}><FontAwesomeIcon icon={faSave} /></button>
                        {deleteButton}
                    </div>
                </div>
                <div className="container grid_system" style={{ borderLeft: "1px solid blue", borderBottom: "1px solid blue" }}>
                    <div className="row">
                        <div className="col-sm-4"><br /><br /><br /></div>
                        <div className="col-sm-4"><br /><b>DAILY PROGRESS REPORT</b><br /><br /></div>
                        <div className="col-sm-4"><AttendancesUpload /></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Date</div>
                        <div className="col-sm-4">
                            <Form.Group controlId="reportDate">
                                <Form.Control
                                    type="date"
                                    value={reportDate ? dateForPicker(reportDate) : ''}
                                    placeholder={reportDate ? dateForPicker(reportDate) : "dd-mm-yyyy"}
                                    onChange={onReportDateChanged}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-sm-3 label-back">Day</div>
                        <div className="col-sm-4">{reportDay}</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">1.0</div>
                        <div className="col-sm-11 label-back"><b>ManHours & Weather Record</b></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 label-back">Man - Hour Expenditure</div>
                        <div className="col-sm-6 label-back">Weather Chart</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6" style={{ padding: "0px" }} >
                            <div className="container-fluid" style={{ border: "0px" }}>
                                <div className="row">
                                    <div className="mid_row   col-sm-3 label-back">Manpower</div>
                                    <div className="mid_row   col-sm-3 label-back">Previous</div>
                                    <div className="mid_row   col-sm-3 label-back">Today</div>
                                    <div className="right_col   col-sm-3 label-back">Cumm</div>
                                </div>
                                <div className="row">
                                    <div className="right_col col-sm-12 label-back">Konsortium HINEH Snd Bhd</div>
                                </div>
                                <div className="row">
                                    <div className="mid_row   col-sm-3 label-back">In-Direct</div>
                                    <div className="mid_row   col-sm-3" style={{ padding: "0px" }}>
                                        <input id="indirectPrev" name="indirectPrev" type="text" autoComplete="off" value={indirectPrev} onChange={(e) => onTextChanged(e, 'indirectPrev')} />
                                    </div>
                                    <div className="mid_row   col-sm-3" style={{ padding: "0px" }}>
                                        <input id="indirectTdy" name="indirectTdy" type="text" autoComplete="off" value={indirectTdy} onChange={(e) => onTextChanged(e, 'indirectTdy')} />
                                    </div>
                                    <div className="right_col   col-sm-3" style={{ padding: "0px" }}>
                                        <input id="indirectCumm" name="indirectCumm" type="text" autoComplete="off" value={indirectCumm} onChange={(e) => onTextChanged(e, 'indirectCumm')} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="bottom_row   col-sm-3 label-back">Direct</div>
                                    <div className="bottom_row   col-sm-3" style={{ padding: "0px" }}>
                                        <input id="directPrev" name="directPrev" type="text" autoComplete="off" value={directPrev} onChange={(e) => onTextChanged(e, 'directPrev')} />
                                    </div>
                                    <div className="bottom_row   col-sm-3" style={{ padding: "0px" }}>
                                        <input id="directTdy" name="directTdy" type="text" autoComplete="off" value={directTdy} onChange={(e) => onTextChanged(e, 'directTdy')} />
                                    </div>
                                    <div className="   col-sm-3" style={{ padding: "0px" }}>
                                        <input id="directCumm" name="directCumm" type="text" autoComplete="off" value={directCumm} onChange={(e) => onTextChanged(e, 'directCumm')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6"></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="" style={{ border: "0px" }}>
                                <div className="row">
                                    <div className=" col-sm-12"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6" >
                            <div className="row container-fluid" style={{ border: "0px" }}>
                                <div className="bottom_row   col-sm-3 label-back">Legend:</div>
                                <div className="bottom_row   col-sm-1" style={{ padding: "0px" }}>
                                    <input id="raining" name="raining" type="text" autoComplete="off" value={raining} onChange={(e) => onTextChanged(e, 'raining')} />
                                </div>
                                <div className="bottom_row   col-sm-2 label-back">Raining</div>
                                <div className="bottom_row   col-sm-1" style={{ padding: "0px" }}>
                                    <input id="driziling" name="driziling" type="text" autoComplete="off" value={driziling} onChange={(e) => onTextChanged(e, 'driziling')} />
                                </div>
                                <div className="bottom_row   col-sm-2 label-back">Dazzling</div>
                                <div className="bottom_row   col-sm-1" style={{ padding: "0px" }}>
                                    <input id="sunny" name="sunny" type="text" autoComplete="off" value={sunny} onChange={(e) => onTextChanged(e, 'sunny')} />
                                </div>
                                <div className="  col-sm-2 label-back">Sunny/Fine</div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">2.0</div>
                        <div className="col-sm-11 label-back"><b>Manpower Loading</b></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-11">
                            <div className="container-fluid" style={{ border: "0px", paddingLeft: "0px", paddingRight: "0px" }}>
                                <div className="" style={{ border: "0px" }}>
                                    <div className="ag-theme-balham" style={{ height: 320, width: "100%", padding: "0px" }}>
                                        <AgGridReact
                                            ref={loadingGridRef}
                                            onCellValueChanged={onCellValueChanged}
                                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                                            defaultColDef={defaultColDef}
                                            rowData={rowData}
                                            columnDefs={columnDefs}>
                                        </AgGridReact>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid" style={{ border: "0px" }}>
                                <div className="row">
                                    <div className="mid_row   col-sm-2 label-back">TOTAL</div>
                                    <div className="mid_row   col-sm-1" style={{ padding: "0px" }}>
                                        <input id="indirectTtl" name="indirectTtl" type="text" autoComplete="off" value={indirectTtl} onChange={(e) => onTextChanged(e, 'indirectTtl')} />
                                    </div>
                                    <div className="mid_row   col-sm-2 label-back">TOTAL</div>
                                    <div className="mid_row   col-sm-1" style={{ padding: "0px" }}>
                                        <input id="directTtl" name="directTtl" type="text" autoComplete="off" value={directTtl} onChange={(e) => onTextChanged(e, 'directTtl')} />
                                    </div>
                                    <div className="mid_row   col-sm-2 label-back">TOTAL</div>
                                    <div className="mid_row   col-sm-1" style={{ padding: "0px" }}>
                                        <input id="directTtl1" name="directTtl1" type="text" autoComplete="off" value={directTtl1} onChange={(e) => onTextChanged(e, 'directTtl1')} />
                                    </div>
                                    <div className="mid_row  col-sm-2 label-back">TOTAL</div>
                                    <div className="right_col   col-sm-1" style={{ padding: "0px" }}>
                                        <input id="ownerTtl" name="ownerTtl" type="text" autoComplete="off" value={ownerTtl} onChange={(e) => onTextChanged(e, 'ownerTtl')} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="right_col   col-sm-12"><p>&nbsp;</p></div>
                                </div>
                                <div className="row">
                                    <div className="bottom_row   col-sm-3 label-back">Sarawakians</div>
                                    <div className="bottom_row   col-sm-2" style={{ padding: "0px" }}>
                                        <input id="pcSarawakians" name="pcSarawakians" type="text" autoComplete="off" value={pcSarawakians} onChange={(e) => onTextChanged(e, 'pcSarawakians')} />
                                    </div>
                                    <div className="bottom_row   col-sm-4 label-back">Non-Sarawakians</div>
                                    <div className="  col-sm-3" style={{ padding: "0px" }}>
                                        <input id="pcNonSarawakians" name="pcNonSarawakians" type="text" autoComplete="off" value={pcNonSarawakians} onChange={(e) => onTextChanged(e, 'pcNonSarawakians')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">3.0</div>
                        <div className="col-sm-11 label-back">Machinery & Equipment Loading</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1"><p>&nbsp;</p></div>
                        <div className="col-sm-11 label-back">
                            <div className="container-fluid" style={{ border: "0px", paddingLeft: "0px", paddingRight: "0px" }}>
                                <div className="" style={{ border: "0px" }}>
                                    <div className="ag-theme-balham" style={{ height: 180, width: "100%", padding: "0px" }}>
                                        <AgGridReact
                                            ref={meLoadingGridRef}
                                            onCellValueChanged={onMECellValueChanged}
                                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                                            defaultColDef={defaultColDef}
                                            rowData={rdMELoading}
                                            columnDefs={meColumnDefs}>
                                        </AgGridReact>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">4.0</div>
                        <div className="col-sm-11 label-back">Safety Briefing / Toolbox Meeting Highlight</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Item</div>
                        <div className="col-sm-11 label-back">Descriptions</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="safetyTbItem" name="safetyTbItem" rows="3" value={safetyTbItem} onChange={(e) => onTextChanged(e, 'safetyTbItem')} />
                        </div>
                        <div className="col-sm-11" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="safetyTbDesp" name="safetyTbDesp" rows="3" value={safetyTbDesp} onChange={(e) => onTextChanged(e, 'safetyTbDesp')} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">5.0</div>
                        <div className="col-sm-11 label-back">Downtime</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Item</div>
                        <div className="col-sm-11 label-back">Descriptions</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="downTimeItem" name="downTimeItem" rows="3" value={downTimeItem} onChange={(e) => onTextChanged(e, 'downTimeItem')} />
                        </div>
                        <div className="col-sm-11" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="downTimeDesp" name="downTimeDesp" rows="3" value={downTimeDesp} onChange={(e) => onTextChanged(e, 'downTimeDesp')} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-1 label-back">6.0</div>
                        <div className="col-sm-11 label-back">Construction / Execution Progress</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Item</div>
                        <div className="col-sm-7 label-back">Job Descriptions</div>
                        <div className="col-sm-4 label-back">Status</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="conProgressItem" name="conProgressItem" rows="8" value={conProgressItem} onChange={(e) => onTextChanged(e, 'conProgressItem')} />
                        </div>
                        <div className="col-sm-7" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="conProgressDesp" name="conProgressDesp" rows="8" value={conProgressDesp} onChange={(e) => onTextChanged(e, 'conProgressDesp')} />
                        </div>
                        <div className="col-sm-4" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="conProgressStatus" name="conProgressStatus" rows="8" value={conProgressStatus} onChange={(e) => onTextChanged(e, 'conProgressStatus')} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-1 label-back">7.0</div>
                        <div className="col-sm-11 label-back">Work Planned For Tomorrow</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Item</div>
                        <div className="col-sm-7 label-back">Job Descriptions</div>
                        <div className="col-sm-4 label-back">Remarks</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="nextDayWPItem" name="nextDayWPItem" rows="4" value={nextDayWPItem} onChange={(e) => onTextChanged(e, 'nextDayWPItem')} />
                        </div>
                        <div className="col-sm-7" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="nextDayWPDesp" name="nextDayWPDesp" rows="4" value={nextDayWPDesp} onChange={(e) => onTextChanged(e, 'nextDayWPDesp')} />
                        </div>
                        <div className="col-sm-4" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="nextDayWPRemarks" name="nextDayWPRemarks" rows="4" value={nextDayWPRemarks} onChange={(e) => onTextChanged(e, 'nextDayWPRemarks')} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">8.0</div>
                        <div className="col-sm-11 label-back">Project Material</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Item</div>
                        <div className="col-sm-5 label-back">P/O & D/O NO.</div>
                        <div className="col-sm-3 label-back">Quantity</div>
                        <div className="col-sm-3 label-back">Status/Remarks</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="prjMaterialItem" name="prjMaterialItem" rows="3" value={prjMaterialItem} onChange={(e) => onTextChanged(e, 'prjMaterialItem')} />
                        </div>
                        <div className="col-sm-5" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="prjMaterialDocNo" name="prjMaterialDocNo" rows="3" value={prjMaterialDocNo} onChange={(e) => onTextChanged(e, 'prjMaterialDocNo')} />
                        </div>
                        <div className="col-sm-3" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="prjMaterialQty" name="prjMaterialQty" rows="3" value={prjMaterialQty.toString()} onChange={(e) => onTextChanged(e, 'prjMaterialQty')} />
                        </div>
                        <div className="col-sm-3" style={{ padding: "0px" }}>
                            <textarea className="form-control" id="prjMaterialStatus" name="prjMaterialStatus" rows="3" value={prjMaterialStatus} onChange={(e) => onTextChanged(e, 'prjMaterialStatus')} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">9.0</div>
                        <div className="col-sm-11 label-back">Area of Concern (AOC)</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Item</div>
                        <div className="col-sm-4 label-back">Descriptions</div>
                        <div className="col-sm-3 label-back">Remedial Plan</div>
                        <div className="col-sm-2 label-back">Status</div>
                        <div className="col-sm-2 label-back">Date Resolved</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1" style={{ padding: "0px" }}>
                            <input id="aocItem" name="aocItem" type="text" autoComplete="off" value={aocItem} onChange={(e) => onTextChanged(e, 'aocItem')} />
                        </div>
                        <div className="col-sm-4" style={{ padding: "0px" }}>
                            <input id="aocDesp" name="aocDesp" type="text" autoComplete="off" value={aocDesp} onChange={(e) => onTextChanged(e, 'aocDesp')} />
                        </div>
                        <div className="col-sm-3" style={{ padding: "0px" }}>
                            <input id="aocRemedialPlan" name="aocRemedialPlan" type="text" autoComplete="off" value={aocRemedialPlan} onChange={(e) => onTextChanged(e, 'aocRemedialPlan')} />
                        </div>
                        <div className="col-sm-2" style={{ padding: "0px" }}>
                            <input id="aocStatus" name="aocStatus" type="text" autoComplete="off" value={aocStatus} onChange={(e) => onTextChanged(e, 'aocStatus')} />
                        </div>
                        <div className="col-sm-2" style={{ padding: "0px" }}>
                            <input id="aocDtResolved" name="aocDtResolved" type="text" autoComplete="off" value={aocDtResolved} onChange={(e) => onTextChanged(e, 'aocDtResolved')} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">10.0</div>
                        <div className="col-sm-11 label-back">Site Technical Quiery</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 label-back">Item</div>
                        <div className="col-sm-7 label-back">Descriptions</div>
                        <div className="col-sm-2 label-back">Date Raised</div>
                        <div className="col-sm-2 label-back">Date Resolved</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1" style={{ padding: "0px" }}>
                            <input id="siteTechQItem" name="siteTechQItem" type="text" autoComplete="off" value={siteTechQItem} onChange={(e) => onTextChanged(e, 'siteTechQItem')} />
                        </div>
                        <div className="col-sm-7" style={{ padding: "0px" }}>
                            <input id="siteTechQIDesp" name="siteTechQIDesp" type="text" autoComplete="off" value={siteTechQIDesp} onChange={(e) => onTextChanged(e, 'siteTechQIDesp')} />
                        </div>
                        <div className="col-sm-2" style={{ padding: "0px" }}>
                            <input id="siteTechQIDtRaised" name="siteTechQIDtRaised" type="text" autoComplete="off" value={siteTechQIDtRaised} onChange={(e) => onTextChanged(e, 'siteTechQIDtRaised')} />
                        </div>
                        <div className="col-sm-2" style={{ padding: "0px" }}>
                            <input id="siteTechQIDtResolved" name="siteTechQIDtResolved" type="text" autoComplete="off" value={siteTechQIDtResolved} onChange={(e) => onTextChanged(e, 'siteTechQIDtResolved')} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4 " style={{ padding: "5px" }}><br />Prepared by:<br /> <input className="" id="preparedBy" name="preparedBy" type="text" autoComplete="off" value={preparedBy} onChange={(e) => onTextChanged(e, 'preparedBy')} /><br />__________________________<br /><br /></div>
                        <div className="col-sm-4 " style={{ padding: "5px" }}><br />Verified by:<br /> <input className="" id="verifiedBy" name="verifiedBy" type="text" autoComplete="off" value={verifiedBy} onChange={(e) => onTextChanged(e, 'verifiedBy')} /><br />__________________________<br /><br /></div>
                        <div className="col-sm-4 " style={{ padding: "5px" }}><br />Ackowledged by:<br /> <input className="" id="acknowledgedBy" name="acknowledgedBy" type="text" autoComplete="off" value={acknowledgedBy} onChange={(e) => onTextChanged(e, 'acknowledgedBy')} /><br />__________________________<br /><br /></div>
                    </div>
                </div>
                <br />
                <div className="panel panel-info">
                    <div className="form-group row">
                        <div className="col-sm-2"><b>ASSIGNED TO:</b></div>
                        <div className="col-sm-2">
                            <select id="userid" name="userid" className="form-control" value={userId} onChange={onUserIdChanged}> {options}</select>
                        </div>
                    </div>
                    <div className="">
                        <p className=""><span>Created: {created}</span><span style={{ padding: "15px" }} /><span>Updated: {updated}</span></p>
                    </div>
                </div>
            </form>
        </>
    )
    return content
}
export default EditDailyReportForm