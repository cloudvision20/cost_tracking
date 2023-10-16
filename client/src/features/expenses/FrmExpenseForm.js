import { useState, useEffect, useMemo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateExpensesMutation, useDeleteExpenseMutation } from './expensesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"

let eExpenses = {}
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
            <div className="form-group -dash-header__nav " style={divButton}>
                <button className="btn btn-danger btn-sm" style={btnStyle} onClick={this.btnDelClickedHandler}>Del</button>
            </div>
        )
    }
}
const FrmExpenseForm = ({ expenses }) => {
    const blankData = { "type": "", "name": "", "capacity": 0, "_id": "" }

    let msgContent = ''
    const msgRef = useRef();

    if (!expenses) {
        msgContent = 'New Expense database'
        msgRef.className = 'resmsg'
        expenses = { blankData }
    } else {
        msgRef.className = 'offscreen'
        msgContent = ''
    }
    const [updateExpenses, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateExpensesMutation()
    const [deleteExpense, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteExpenseMutation()
    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const expenseGridRef = useRef();

    let data = Array.from(expenses).map((data, index) => ({
        "type": data.type,
        "name": data.name,
        "capacity": data.capacity ? parseFloat(data.capacity) : 0,
        "_id": data._id
    }))

    const [rdExpense, setRdExpense] = useState(data)
    const [expenseColDefs] = useState([
        { field: '_id', headerName: 'Id', width: 150 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        { field: "type", headerName: 'Type', width: 150, editable: true },
        { field: "capacity", headerName: 'Capacity', width: 150, editable: true },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {

                    if (this.data._id) { delRecord(this.data._id) }
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "expense"
            },
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onSaveClicked = async (e) => {
        e.preventDefault()
        eExpenses.data = rdExpense

        await updateExpenses(eExpenses)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                data = result.data.data.map((data, index) => ({
                    "type": data.type,
                    "name": data.name,
                    "capacity": data.capacity ? parseFloat(data.capacity) : 0,
                    "_id": data._id
                }))
                setRdExpense(data)
                expenseGridRef.current.api.refreshCells()
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                msgRef.className = "offscreen"
            })
    }

    const delRecord = async (_id) => {
        await deleteExpense({ id: _id })
            .then((result) => {


            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                let rData = []
                expenseGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdExpense(rData)
            }
            )
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdExpense))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdExpense ?
                [...rdExpense, blankData]
                : [blankData]
        setRdExpense(newRData)
    }
    const errRef = useRef();
    useEffect(() => {
        errRef.className = "resmsg"
        isSuccess ? errContent.current = " Saved!"
            : errContent.current = "Deleted!"
    }, [isSuccess, isDelSuccess, navigate])

    // useEffect(() => {
    //     console.log('useEffect-rowData: \n' + JSON.stringify(rdExpense))
    // })
    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent.current}</p>

            <div className="panel panel-default" id="resourceDIV" style={{ fontSize: '14px' }}>
                <div className="panel-heading"><h5>Expenses</h5></div>
                <div className="form-group  dash-header__nav">
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
                <div className="panel-body">
                    <div className="container-sm ag-theme-balham" style={{ height: 400, width: "100%", fontSize: '12px' }}>
                        <p ref={msgRef} className="" >{msgContent}</p>
                        <AgGridReact
                            ref={expenseGridRef}
                            onCellValueChanged={onValueChanged}
                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                            // onRowDataUpdated={(event) => event.current.api.refreshCells()}
                            defaultColDef={defaultColDef}
                            rowData={rdExpense}
                            columnDefs={expenseColDefs}>

                        </AgGridReact>
                    </div>
                </div>
            </div>
        </>
    )

    return content

}

export default FrmExpenseForm