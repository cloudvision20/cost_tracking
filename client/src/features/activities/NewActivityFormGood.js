import { useState, useEffect, useMemo, Component } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewActivityMutation } from "./activitiesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FormControl, Form } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import { dateForPicker, dateFromDateString } from "../../hooks/useDatePicker"
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


let rowId = 0
class BtnCellRenderer extends Component {
    constructor(props) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
        this.btnDelClickedHandler = this.btnDelClickedHandler.bind(this);
    }
    btnClickedHandler(e) {
        e.preventDefault()
        //this.props.preventDefault();
        // alert(this.props.value);
        this.props.clicked(this.props.value);
    }
    btnDelClickedHandler(e) {
        e.preventDefault()
        //this.props.preventDefault();
        //alert(e.target.value);
        this.props.delClicked(this.props.value);
    }
    render() {
        return (
            <>
                <span>
                    <button className="btn btn-primary btn-sm" onClick={this.btnClickedHandler}>Assign</button>
                </span>
                <span>
                    <button className="btn btn-danger btn-sm" onClick={this.btnDelClickedHandler}>Del</button>
                </span>
            </>
        )
    }

}

const NewActivityForm = ({ users }) => {

    const [addNewActivity, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewActivityMutation()

    const navigate = useNavigate()

    const data =
    {

        "type": "",
        "details": "",
        "job": "",
        "costType": "",
        "uom": "",
        "rate": "",
        "qtyAssign": "",
        "remarks": "",
        "rowId": 0

    }
    const [rowData, setRowData] = useState([data])
    //setRowId(RowId + 1)
    let editedActivity = {}
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            editable: true,
        };
    }, []);

    const [columnDefs] = useState([
        {
            field: 'rowId',
            headerName: 'idx',
            width: 100,

        },
        {
            field: 'type',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            filter: 'agSetColumnFilter',
            cellEditorPopup: false,
            cellEditorParams: {
                values: ['Labour', 'Equipment', 'Consumable'],
            },
        },
        { field: "details", editable: true },
        { field: "job", editable: true },
        { field: "costType", editable: true },
        { field: "uom", editable: true },
        { field: "rate", editable: true },
        { field: "qtyAssign", editable: true },
        { field: "remarks", editable: true },
        {

            headerName: 'Assignment',
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (field) {
                    alert(`${JSON.stringify(this.data)} was clicked`);
                },
                delClicked: function () {
                    //alert(`${JSON.stringify(this.data)} was clicked`);
                    this.api.applyTransaction({ remove: [this.data] });
                },
            },
        }
    ]
    );

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [completed, setCompleted] = useState(false)
    const [userId, setUserId] = useState(users[0].id)
    const [processUOM, setProcessUOM] = useState('')
    const [processQuantity, setProcessQuantity] = useState('')
    const [durationUOM, setDurationUOM] = useState('')
    const [durationQuantity, setDurationQuantity] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setDescription('')
            setCompleted(false)
            setUserId('')
            setProcessUOM('')
            setProcessQuantity('')
            setDurationUOM('')
            setDurationQuantity('')
            navigate('/dash/activities')
        }
    }, [isSuccess, navigate])
    useEffect(() => {
        console.log('rowData useEffect = ' + JSON.stringify(rowData))
    }, [rowData])
    const onNameChanged = e => setName(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onCompletedChanged = e => setCompleted(e.target.value ? true : false)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onProcessUOMChanged = e => setProcessUOM(e.target.value)
    const onProcessQuantityChanged = e => setProcessQuantity(e.target.value)
    const onDurationUOMChanged = e => setDurationUOM(e.target.value)
    const onDurationQuantityChanged = e => setDurationQuantity(e.target.value)
    const onCellValueChanged = (e) => {
        //e.preventDefault()
        console.log('onCellValueChanged-rowData:' + JSON.stringify(rowData))
    }

    const onStartDateChanged = (e) => setStartDate(e.target.value)
    const onEndDateChanged = (e) => setEndDate(e.target.value)

    const onNewResourcesClicked = (e) => {
        e.preventDefault()


        rowId = rowId + 1
        let newRowData = [...rowData, {

            "type": "",
            "details": "",
            "job": "",
            "costType": "",
            "uom": "",
            "rate": "",
            "qtyAssign": "",
            "remarks": "",
            "rowId": rowId

        }]
        setRowData(newRowData)
        console.log(JSON.stringify(newRowData))
        //console.log(JSON.stringify(rowData))
    }

    const canSave = [userId].every(Boolean) && !isLoading

    const onSaveActivityClicked = async (e) => {
        let process = {}
        let duration = {}
        e.preventDefault()
        if (canSave) {
            editedActivity.name = name
            editedActivity.description = description
            editedActivity.startDate = startDate
            editedActivity.endDate = endDate
            editedActivity.completed = completed
            editedActivity.userId = userId
            process.uom = processUOM
            process.quantity = processQuantity
            editedActivity.process = process
            duration.uom = durationUOM
            duration.quantity = durationQuantity
            editedActivity.duration = duration
            editedActivity.resources = rowData
            console.log(editedActivity)
            console.log(JSON.stringify(editedActivity))
            await addNewActivity(editedActivity)
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

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form onSubmit={onSaveActivityClicked}>
                <div className="panel">
                    <h2>New Activity</h2>
                    <div className="form-group dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="Save"
                            onClick={onSaveActivityClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Name:</div>
                    <div className="col-sm-6">
                        <input
                            className="form-control"
                            id="activity-name"
                            name="Name"
                            type="text"
                            placeholder="Name"
                            autoComplete="off"
                            value={name}
                            onChange={onNameChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Description:</div>
                    <div className="col-sm-6">
                        <textarea
                            className="form-control"
                            id="activity-description"
                            name="description"
                            placeholder="Description"
                            rows="4"
                            value={description}
                            onChange={onDescriptionChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Activity Process:</div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="process-unit"
                            name="process-unit"
                            type="text"
                            placeholder="Process Unit"
                            autoComplete="off"
                            value={processUOM}
                            onChange={onProcessUOMChanged}
                        />
                    </div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="process-quantity"
                            name="process-quantity"
                            type="text"
                            placeholder="Process Quantity"
                            autoComplete="off"
                            value={processQuantity}
                            onChange={onProcessQuantityChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Start / End Dates:</div>
                    <div className="col-md-2">
                        <Form.Group controlId="startDate">
                            <Form.Control
                                type="date"
                                value={startDate ? dateForPicker(startDate) : ''}
                                placeholder={startDate ? dateForPicker(startDate) : "dd-mm-yyyy"}
                                onChange={onStartDateChanged}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <Form.Group controlId="endDate">
                            <Form.Control
                                type="date"
                                value={endDate ? dateForPicker(endDate) : ''}
                                placeholder={endDate ? dateForPicker(endDate) : "dd-mm-yyyy"}
                                onChange={onEndDateChanged}
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2">Activity Duration:</div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="duration-unit"
                            name="duration-unit"
                            type="text"
                            placeholder="Duration Unit"
                            autoComplete="off"
                            value={durationUOM}
                            onChange={onDurationUOMChanged}
                        />
                    </div>
                    <div className="col-sm-3">
                        <input
                            className="form-control"
                            id="duration-quantity"
                            name="duration-quantity"
                            type="text"
                            placeholder="Duration Quantity"
                            autoComplete="off"
                            value={durationQuantity}
                            onChange={onDurationQuantityChanged}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2" >Resources:</div>
                    <div className="form-group  dash-header__nav">
                        <button
                            className="btn btn-primary"
                            title="New Resources"
                            onClick={onNewResourcesClicked}
                        >
                            Add Resouces
                        </button>
                    </div>
                    <div className="table-responsive-sm">
                        <div className="ag-theme-alpine" style={{ height: 200, width: "100%" }}>
                            <AgGridReact
                                onCellValueChanged={onCellValueChanged}
                                onGridReady={(event) => event.api.sizeColumnsToFit()}
                                defaultColDef={defaultColDef}
                                rowData={rowData}
                                columnDefs={columnDefs}>
                            </AgGridReact>
                        </div>
                    </div>
                </div>
                <div className="panel panel-info">

                    <div className="form-group row">
                        <div className="col-sm-2"> WORK COMPLETE:</div>
                        <div className="col-sm-10">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    id="activity-completed"
                                    name="completed"
                                    type="checkbox"
                                    checked={completed}
                                    onChange={onCompletedChanged}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2"> ASSIGNED TO:</div>
                        <div className="col-sm-2">
                            <select
                                id="username"
                                name="username"
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

export default NewActivityForm