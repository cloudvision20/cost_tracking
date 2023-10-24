import { useState, useEffect, useMemo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateMastersMutation, useDeleteMasterMutation } from './mastersApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"

let eMasters = {}
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
const EditMasterForm = ({ masters, formType }) => {
    const blankData = { "type": "", "name": "", "capacity": 0, "unit": "", "_id": "" }
    //formType = formType ? formType : 'Consumables'
    let msgContent = ''
    const msgRef = useRef();

    if (!masters) {
        msgContent = `New ${formType} database`
        msgRef.className = 'resmsg'
        masters = { blankData }
    } else {
        msgRef.className = 'offscreen'
        msgContent = ''
    }
    const [updateMasters, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateMastersMutation()
    const [deleteMaster, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteMasterMutation()
    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const masterGridRef = useRef();

    let data = Array.from(masters).map((data, index) => ({
        "type": data.type,
        "name": data.name,
        "capacity": data.capacity ? parseFloat(data.capacity) : 0,
        "unit": data.unit,
        "_id": data._id
    }))

    const [rdMaster, setRdMaster] = useState(data)
    const [masterColDefs] = useState([
        { field: '_id', headerName: 'Id', width: 150 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        { field: "type", headerName: 'Type', width: 150, editable: true },
        { field: "capacity", headerName: 'Capacity', width: 150, editable: true },
        { field: "unit", headerName: 'Unit', width: 150, editable: true },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {

                    if (this.data._id) { delRecord(this.data._id) }
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "master"
            },
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onSaveClicked = async (e) => {
        e.preventDefault()
        eMasters.data = rdMaster
        eMasters.formType = formType
        await updateMasters(eMasters)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                data = result.data.data.map((data, index) => ({
                    "type": data.type,
                    "name": data.name,
                    "capacity": data.capacity ? parseFloat(data.capacity) : 0,
                    "unit": data.unit,
                    "_id": data._id
                }))
                setRdMaster(data)
                masterGridRef.current.api.refreshCells()
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                msgRef.className = "offscreen"
            })
    }

    const delRecord = async (_id) => {
        await deleteMaster({ id: _id, formType: formType })
            .then((result) => {


            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                let rData = []
                masterGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdMaster(rData)
            }
            )
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdMaster))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdMaster ?
                [...rdMaster, blankData]
                : [blankData]
        setRdMaster(newRData)
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
                    <div className="col-sm-12" style={{ border: "0px" }}><h4><b>Edit {formType} </b></h4></div>
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
                            ref={masterGridRef}
                            onCellValueChanged={onValueChanged}
                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                            // onRowDataUpdated={(event) => event.current.api.refreshCells()}
                            defaultColDef={defaultColDef}
                            rowData={rdMaster}
                            columnDefs={masterColDefs}>

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

export default EditMasterForm