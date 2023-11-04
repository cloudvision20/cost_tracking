import { useState, useEffect, useMemo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateTypesMutation, useDeleteTypeMutation } from './typesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"

let eTypes = {}
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
const FrmTypesForm = ({ types }) => {
    const blankData = { "category": "", "name": "", "_id": "", "remarks": "" }
    let msgContent = ''
    const msgRef = useRef();

    if (types._id === null) {
        msgContent = `New Type database`
        msgRef.className = 'resmsg'
        //types = ptypes
    } else {
        msgRef.className = 'offscreen'
        msgContent = ''
    }
    const [updateTypes, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateTypesMutation()

    const [deleteType, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteTypeMutation()

    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const typeGridRef = useRef();

    let data = Array.from(types).map((data, index) => ({
        "_id": data._id,
        "category": data.category,
        "name": data.name,
        "remarks": data.remarks
    }))
    const [rdType, setRdType] = useState(data)
    const arrCategory = ['Consumables', 'Equipment', 'Expenses', 'PNG_Faciity', 'PNG_Mobilization', 'PNG_Supervisor']
    const [typeColDefs] = useState([
        { field: '_id', headerName: 'Id', width: 150 },
        // { field: "category", headerName: 'Category', width: 150, editable: true },
        {
            field: 'category',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            filter: 'agSetColumnFilter',
            cellEditorPopup: false,
            cellEditorParams: {
                values: arrCategory,
            },
        },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        { field: "remarks", headerName: 'remarks', width: 250, editable: true },
        {
            headerName: 'Actions',
            width: 75,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {

                    if (this.data._id) { delRecord(this.data._id) }
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "type"
            },
        }
    ])

    let errClass = (isError || isDelError) ? "errmsg" : "errmsg" //"offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onSaveClicked = async (e) => {
        e.preventDefault()
        eTypes.data = rdType
        await updateTypes(eTypes)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                data = result.data.data.map((data, index) => ({
                    "category": data.category,
                    "name": data.name,
                    "remarks": data.remarks,
                    "_id": data._id
                }))
                setRdType(data)
                typeGridRef.current.api.refreshCells()
                errClass = "resmsg"
                errRef.className = "resmsg"
                errContent.current = " Saved!"
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                //msgRef.className = "offscreen"
            })
    }

    const delRecord = async (_id) => {
        await deleteType({ id: _id })
            .then((result) => {


            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                let rData = []
                typeGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdType(rData)
            }
            )
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdType))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdType ?
                [...rdType, blankData]
                : [blankData]
        setRdType(newRData)
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
                    <br />
                </div>
                <div className="row">
                    <div className="col-sm-12" style={{ border: "0px" }}><h4><b>Edit Types </b></h4></div>
                </div>

                <div className="row">
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
                </div>
                <div className="row">
                    <div className="container-sm ag-theme-balham" style={{ height: 400, width: "100%", fontSize: '12px' }}>
                        <p ref={msgRef} className="" >{msgContent}</p>
                        <AgGridReact
                            ref={typeGridRef}
                            onCellValueChanged={onValueChanged}
                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                            // onRowDataUpdated={(event) => event.current.api.refreshCells()}
                            defaultColDef={defaultColDef}
                            rowData={rdType}
                            columnDefs={typeColDefs}>

                        </AgGridReact>
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

export default FrmTypesForm