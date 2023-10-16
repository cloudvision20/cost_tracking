import { useState, useEffect, useMemo, useRef, Component } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewDailyReportMutation } from "../dailyReportsApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import { todayForPicker, today2Weekday, date2Weekday, dateForPicker, dateFromDateString } from "../../../hooks/useDatePicker"
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
let rowId = 0
let meRowId = 0

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
        this.props.delClicked(this.props);
    }
    render() {
        return (
            <div className="form-group dash-header__nav">
                <button
                    className="btn btn-danger btn-xs"
                    style={{ fontSize: "8px" }}
                    onClick={this.btnDelClickedHandler}>Del</button>
            </div>
        )
    }
}

const NewDailyReportForm = ({ ActivityId, users }) => {

    const [addNewDailyReport, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewDailyReportMutation()

    const navigate = useNavigate()

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
        };
    }, []);
    const data = {
        "indirect": null,
        "indirectPax": null,
        "direct": null,
        "directPax": null,
        "direct1": null,
        "directPax1": null,
        "owner": null,
        "ownerPax": null,
        "rowId": 0,
        "isDirty": false
    }
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
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (field) {

                },
                delClicked: function () {
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "loading"
            },
        }
    ])

    const loadingGridRef = useRef();
    const [rowData, setRowData] = useState([data])
    const [currLoadId, setCurrLoadId] = useState('')

    const meData = {
        "load1": null,
        "pax1": null,
        "load2": null,
        "pax2": null,
        "load3": null,
        "pax3": null,
        "load4": null,
        "pax4": null,
        "load5": null,
        "pax5": null
    }
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
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (field) {

                },
                delClicked: function () {
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "meloading"
            },
        }
    ])

    const meLoadingGridRef = useRef();
    const [rdMELoading, setRdMELoading] = useState([meData])

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [reportDate, setReportDate] = useState(todayForPicker())
    const [reportDay, setReportDay] = useState(today2Weekday())

    const [indirectPrev, setIndirectPrev] = useState(0)
    const [indirectTdy, setIndirectTdy] = useState(0)
    const [indirectCumm, setIndirectCumm] = useState(0)
    const [directPrev, setDirectPrev] = useState(0)
    const [directTdy, setDirectTdy] = useState(0)
    const [directCumm, setDirectCumm] = useState(0)

    const [raining, setRaining] = useState('')
    const [driziling, setDriziling] = useState('')
    const [sunny, setSunny] = useState('')

    const [indirectTtl, setIndirectTtl] = useState(0)
    const [directTtl, setDirectTtl] = useState(0)
    const [directTtl1, setDirectTtl1] = useState(0)
    const [ownerTtl, setOwnerTtl] = useState(0)
    const [pcSarawakians, setPcSarawakians] = useState(0)
    const [pcNonSarawakians, setPcNonSarawakians] = useState(0)

    const [meLoadingTtl, setMeLoadingTtl] = useState(0)
    // Safety Toolbox
    const [safetyTbItem, setSafetyTbItem] = useState('')
    const [safetyTbDesp, setSafetyTbDesp] = useState('')
    //Downtime
    const [downTimeItem, setDownTimeItem] = useState('')
    const [downTimeDesp, setDownTimeDesp] = useState('')
    //Construction Progress
    const [conProgressItem, setConProgressItem] = useState('')
    const [conProgressDesp, setConProgressDesp] = useState('')
    const [conProgressStatus, setConProgressStatus] = useState('')
    //Next Day Work Plan
    const [nextDayWPItem, setNextDayWPItem] = useState('')
    const [nextDayWPDesp, setNextDayWPDesp] = useState('')
    const [nextDayWPRemarks, setNextDayWPRemarks] = useState('')
    //Project Material
    const [prjMaterialItem, setPrjMaterialItem] = useState('')
    const [prjMaterialDocNo, setPrjMaterialDocNo] = useState('') //PO ,DO number
    const [prjMaterialQty, setPrjMaterialQty] = useState(0)
    const [prjMaterialStatus, setPrjMaterialStatus] = useState('') // status and remarks
    //Area Of Concern
    const [aocItem, setAocItem] = useState('')
    const [aocDesp, setAocDesp] = useState('')
    const [aocRemedialPlan, setAocRemedialPlan] = useState('')
    const [aocStatus, setAocStatus] = useState('') // status and remarks
    const [aocDtResolved, setAocDtResolved] = useState('')
    //site Tech Query
    const [siteTechQItem, setSiteTechQItem] = useState('')
    const [siteTechQIDesp, setSiteTechQIDesp] = useState('')
    const [siteTechQIDtRaised, setSiteTechQIDtRaised] = useState('')
    const [siteTechQIDtResolved, setSiteTechQIDtResolved] = useState('')

    const [preparedBy, setPreparedBy] = useState('')
    const [verifiedBy, setVerifiedBy] = useState('')
    const [acknowledgedBy, setAcknowledgedBy] = useState('')
    const [completed, setCompleted] = useState(false)
    const [userId, setUserId] = useState(users[0].id)

    // const [activityId, setActivityId] = useState('')
    // if (ActivityId) { setActivityId(ActivityId) }

    useEffect(() => {
        setReportDay(date2Weekday(reportDate))
    }, [reportDate])

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            setReportDate('')
            setReportDay('')
            navigate(-1)
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onReportDateChanged = (e) => setReportDate(e.target.value)
    const onTextChanged = (e, type) => {
        switch (type) {
            // case 'indirectPrev':
            //     return setIndirectPrev(e.target.value)
            case 'indirectPrev':
                return setIndirectPrev(e.target.value)
            case 'indirectTdy':
                return setIndirectTdy(e.target.value)
            case 'indirectCumm':
                return setIndirectCumm(e.target.value)
            case 'directPrev':
                return setDirectPrev(e.target.value)
            case 'directTdy':
                return setDirectTdy(e.target.value)
            case 'directCumm':
                return setDirectCumm(e.target.value)
            case 'raining':
                return setRaining(e.target.value)
            case 'driziling':
                return setDriziling(e.target.value)
            case 'sunny':
                return setSunny(e.target.value)
            case 'indirectTtl':
                return setIndirectTtl(e.target.value)
            case 'directTtl':
                return setDirectTtl(e.target.value)
            case 'directTtl1':
                return setDirectTtl1(e.target.value)
            case 'ownerTtl':
                return setOwnerTtl(e.target.value)
            case 'pcSarawakians':
                return setPcSarawakians(e.target.value)
            case 'pcNonSarawakians':
                return setPcNonSarawakians(e.target.value)

            //Safety Toolbox
            case 'safetyTbItem':
                return setSafetyTbItem(e.target.value)
            case 'safetyTbDesp':
                return setSafetyTbDesp(e.target.value)
            //Downtime
            case 'downTimeItem':
                return setDownTimeItem(e.target.value)
            case 'downTimeDesp':
                return setDownTimeDesp(e.target.value)
            //Construction Progress
            case 'conProgressItem':
                return setConProgressItem(e.target.value)
            case 'conProgressDesp':
                return setConProgressDesp(e.target.value)
            case 'conProgressStatus':
                return setConProgressStatus(e.target.value)
            //Next Day Work Plan
            case 'nextDayWPItem':
                return setNextDayWPItem(e.target.value)
            case 'nextDayWPDesp':
                return setNextDayWPDesp(e.target.value)
            case 'nextDayWPRemarks':
                return setNextDayWPRemarks(e.target.value)

            //Project Material
            case 'prjMaterialItem':
                return setPrjMaterialItem(e.target.value)
            case 'prjMaterialDocNo':
                return setPrjMaterialDocNo(e.target.value) //PO ,DO number
            case 'prjMaterialQty':
                return setPrjMaterialQty(e.target.value)
            case 'prjMaterialStatus':
                return setPrjMaterialStatus(e.target.value) // status and remarks
            //Area Of Concern
            case 'aocItem':
                return setAocItem(e.target.value)
            case 'aocDesp':
                return setAocDesp(e.target.value)
            case 'aocRemedialPlan':
                return setAocRemedialPlan(e.target.value)
            case 'aocStatus':
                return setAocStatus(e.target.value) // status and remarks
            case 'aocDtResolved':
                return setAocDtResolved(e.target.value)
            //site Tech Query
            case 'siteTechQItem':
                return setSiteTechQItem(e.target.value)
            case 'siteTechQIDesp':
                return setSiteTechQIDesp(e.target.value)
            case 'siteTechQIDtRaised':
                return setSiteTechQIDtRaised(e.target.value)
            case 'siteTechQIDtResolved':
                return setSiteTechQIDtResolved(e.target.value)

            case 'preparedBy':
                return setPreparedBy(e.target.value)
            case 'verifiedBy':
                return setVerifiedBy(e.target.value)
            case 'acknowledgedBy':
                return setAcknowledgedBy(e.target.value)


            default:
                return setText(e.target.value)
        }
    }

    const onCellValueChanged = (e) => {
        console.log('onCellValueChanged-rowData:' + JSON.stringify(rowData))

        if (e.data.indirect || e.data.indirectPax || e.data.direct || e.data.directPax || e.data.direct1 || e.data.directPax1 || e.data.owner || e.ownerPax) {
            e.data.isDirty = true
            if (rowData[rowId].isDirty) {
                newLoadingClicked(e)
            }
        } else {
            e.data.isDirty = false
        }
    }

    const newLoadingClicked = (e) => {
        // e.preventDefault()
        rowId = rowId + 1
        let newRowData = [...rowData, {
            "indirect": null,
            "indirectPax": null,
            "direct": null,
            "directPax": null,
            "direct1": null,
            "directPax1": null,
            "owner": null,
            "ownerPax": null,
            "rowId": 'new' + rowId.toString(),
            "isDirty": false
        }]
        setRowData(newRowData)
        console.log(JSON.stringify(newRowData))
    }

    const onMECellValueChanged = (e) => {
        console.log('onCellValueChanged-rowData:' + JSON.stringify(rowData))

        if (e.data.load1 || e.data.pax1 || e.data.load2 || e.data.pax2 || e.data.load3 || e.data.pax3 || e.data.load4 || e.data.pax4 || e.data.load5 || e.data.pax5) {
            e.data.isDirty = true
            if (rdMELoading[meRowId].isDirty) {
                newRowMELoadingClicked(e)
            }
        } else {
            e.data.isDirty = false
        }
    }

    const newRowMELoadingClicked = (e) => {
        // e.preventDefault()
        meRowId = meRowId + 1
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
            "rowId": 'new' + meRowId.toString(),
            "isDirty": false
        }]
        setRdMELoading(newRdMELoading)
        console.log(JSON.stringify(newRdMELoading))
    }

    const canSave = [userId].every(Boolean) && !isLoading

    const onSaveDailyReportClicked = async (e) => {
        e.preventDefault()
        let eDailyReport = {}
        let weatherChart = {}
        let manHour = {}
        if (canSave) {
            eDailyReport.activityId = ActivityId
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

            manHour.loading = rowData.filter(rd => { return rd.isDirty })

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
            eDailyReport.meLoading = rdMELoading.filter(rd => { return rd.isDirty })

            eDailyReport.meLoadingTtl = meLoadingTtl

            //safetyToolbox
            if (!safetyTbItem) {
                eDailyReport.safetyTbItem = ''
            } else {
                eDailyReport.safetyTbItem = safetyTbItem
            }
            if (!safetyTbDesp) {
                eDailyReport.safetyTbDesp = ''
            } else {
                eDailyReport.safetyTbDesp = safetyTbDesp
            }

            //downTime
            if (!downTimeItem) {
                eDailyReport.downTimeItem = ''
            } else {
                eDailyReport.downTimeItem = downTimeItem
            }
            if (!downTimeDesp) {
                eDailyReport.downTimeDesp = ''
            } else {
                eDailyReport.downTimeDesp = downTimeDesp
            }

            //constructionProgress
            if (!conProgressItem) {
                eDailyReport.conProgressItem = ''
            } else {
                eDailyReport.conProgressItem = conProgressItem
            }
            if (!conProgressDesp) {
                eDailyReport.conProgressDesp = ''
            } else {
                eDailyReport.conProgressDesp = conProgressDesp
            }
            if (!conProgressStatus) {
                eDailyReport.conProgressStatus = ''
            } else {
                eDailyReport.conProgressStatus = conProgressStatus
            }
            //nextDayWorkPlan
            if (!nextDayWPItem) {
                eDailyReport.nextDayWPItem = ''
            } else {
                eDailyReport.nextDayWPItem = nextDayWPItem
            }
            if (!nextDayWPDesp) {
                eDailyReport.nextDayWPDesp = ''
            } else {
                eDailyReport.nextDayWPDesp = nextDayWPDesp
            }
            if (!nextDayWPRemarks) {
                eDailyReport.nextDayWPRemarks = ''
            } else {
                eDailyReport.nextDayWPRemarks = nextDayWPRemarks
            }

            //projectMaterial
            if (!prjMaterialItem) {
                eDailyReport.prjMaterialItem = ''
            } else {
                eDailyReport.prjMaterialItem = prjMaterialItem
            }
            if (!prjMaterialDocNo) {
                eDailyReport.prjMaterialDocNo = '' //PO ,DO number
            } else {
                eDailyReport.prjMaterialDocNo = prjMaterialDocNo //PO ,DO number
            }
            if (!prjMaterialQty) {
                eDailyReport.prjMaterialQty = 0
            } else {
                eDailyReport.prjMaterialQty = parseFloat(prjMaterialQty)
            }
            if (!prjMaterialStatus) {
                eDailyReport.prjMaterialStatus = '' // status and remarks
            } else {
                eDailyReport.prjMaterialStatus = prjMaterialStatus // status and remarks
            }

            //areaOfConcern
            if (!aocItem) {
                eDailyReport.aocItem = ''
            } else {
                eDailyReport.aocItem = aocItem
            }
            if (!aocDesp) {
                eDailyReport.aocDesp = '' //PO ,DO number
            } else {
                eDailyReport.aocDesp = aocDesp //PO ,DO number
            }
            if (!aocRemedialPlan) {
                eDailyReport.aocRemedialPlan = ''
            } else {
                eDailyReport.aocRemedialPlan = aocRemedialPlan
            }
            if (!aocStatus) {
                eDailyReport.aocStatus = ''// status and remarks
            } else {
                eDailyReport.aocStatus = aocStatus// status and remarks
            }
            if (!aocDtResolved) {
                eDailyReport.aocDtResolved = ''
            } else {
                eDailyReport.aocDtResolved = aocDtResolved
            }

            //site Tech Query
            if (!siteTechQItem) {
                eDailyReport.siteTechQItem = ''
            } else {
                eDailyReport.siteTechQItem = siteTechQItem
            }
            if (!siteTechQIDesp) {
                eDailyReport.siteTechQIDesp = ''
            } else {
                eDailyReport.siteTechQIDesp = siteTechQIDesp//PO ,DO number
            }
            if (!siteTechQIDtRaised) {
                eDailyReport.siteTechQIDtRaised = ''
            } else {
                eDailyReport.siteTechQIDtRaised = siteTechQIDtRaised
            }
            if (!siteTechQIDtResolved) {
                eDailyReport.siteTechQIDtResolved = ''
            } else {
                eDailyReport.siteTechQIDtResolved = siteTechQIDtResolved
            }

            eDailyReport.acknowledgedBy = acknowledgedBy
            eDailyReport.verifiedBy = verifiedBy //PO ,DO number
            eDailyReport.preparedBy = preparedBy
            eDailyReport.completed = completed

            console.log(eDailyReport)
            console.log(JSON.stringify(eDailyReport))
            //await addNew(!prjMaterialQty)DailyReport({ user: userId, title, text, reportDate, reportDay, completed })
            await addNewDailyReport(eDailyReport)
        }
    }

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    // const validTitleClass = !title ? "form__input--incomplete" : ''
    // const validTextClass = !text ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form onSubmit={onSaveDailyReportClicked}>
                <div className="panel">
                    <h5><b>New DailyReport</b></h5>
                    <div className="form-group dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveDailyReportClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <div className="container grid_system" style={{ borderLeft: "1px solid blue", borderBottom: "1px solid blue" }}>
                    <div className="row">
                        <div className="col-sm-4"><br /><br /><br /></div>
                        <div className="col-sm-4"><br /><b>DAILY PROGRESS REPORT</b><br /><br /></div>
                        <div className="col-sm-4"><br /><br /><br /></div>
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
                        <div className="col-sm-6">

                        </div>
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
                        <div className="col-sm-1 "><p>&nbsp;</p></div>
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
                    {/* </div> */}
                </div>
                <br />
                <div className="panel panel-info">
                    <div className="form-group row">
                        <div className="col-sm-2"><b>ASSIGNED TO:</b></div>
                        <div className="col-sm-2">
                            <select
                                id="userid"
                                name="userid"
                                className="form-control"
                                value={userId}
                                onChange={onUserIdChanged}
                            >
                                {options}
                            </select>
                        </div>
                    </div>
                </div>
            </form>

        </>
    )


    return content
}

export default NewDailyReportForm