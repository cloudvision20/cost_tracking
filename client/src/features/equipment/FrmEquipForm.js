import { useState, useEffect, useMemo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useUpdateEquipmentMutation, useDeleteEquipMutation } from './equipmentApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"

let eEquipment = {}
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
const FrmEquipForm = ({ equipment }) => {
    const blankData = { "type": "", "name": "", "capacity": 0, "_id": "" }

    let msgContent = ''
    const msgRef = useRef();

    if (!equipment) {
        msgContent = 'New Equip database'
        msgRef.className = 'resmsg'
        equipment = { blankData }
    } else {
        msgRef.className = 'offscreen'
        msgContent = ''
    }
    const [updateEquipment, {
        //isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateEquipmentMutation()
    const [deleteEquip, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteEquipMutation()
    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const equipGridRef = useRef();

    let data = Array.from(equipment).map((data, index) => ({
        "type": data.type,
        "name": data.name,
        "capacity": data.capacity ? parseFloat(data.capacity) : 0,
        "_id": data._id
    }))

    const [rdEquip, setRdEquip] = useState(data)
    const [equipColDefs] = useState([
        { field: '_id', headerName: 'Id', width: 150 },
        { field: 'name', headerName: 'Name', width: 150, frmable: true },
        { field: "type", headerName: 'Type', width: 150, frmable: true },
        { field: "capacity", headerName: 'Capacity', width: 150, frmable: true },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                delClicked: function (eprops) {

                    if (this.data._id) { delRecord(this.data._id) }
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "equip"
            },
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = useRef((error?.data?.message || delerror?.data?.message) ?? '');
    const onSaveClicked = async (e) => {
        e.preventDefault()
        eEquipment.data = rdEquip

        await updateEquipment(eEquipment)
            .then((result) => {
                console.log(` result = ${JSON.stringify(result)}`)
                data = result.data.data.map((data, index) => ({
                    "type": data.type,
                    "name": data.name,
                    "capacity": data.capacity ? parseFloat(data.capacity) : 0,
                    "_id": data._id
                }))
                setRdEquip(data)
                equipGridRef.current.api.refreshCells()
            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                msgRef.className = "offscreen"
            })
    }

    const delRecord = async (_id) => {
        await deleteEquip({ id: _id })
            .then((result) => {


            }).catch((error) => {
                console.log(`error: ${error}`)
            }).finally(() => {
                let rData = []
                equipGridRef.current.api.forEachNode(node => rData.push(node.data));
                setRdEquip(rData)
            }
            )
    }
    const onValueChanged = (e) => {
        console.log('onValueChanged-rowData:' + JSON.stringify(rdEquip))
    }
    const onNewClicked = (e) => {
        e.preventDefault()
        let newRData =
            rdEquip ?
                [...rdEquip, blankData]
                : [blankData]
        setRdEquip(newRData)
    }
    const errRef = useRef();
    useEffect(() => {
        errRef.className = "resmsg"
        isSuccess ? errContent.current = " Saved!"
            : errContent.current = "Deleted!"
    }, [isSuccess, isDelSuccess, navigate])

    // useEffect(() => {
    //     console.log('useEffect-rowData: \n' + JSON.stringify(rdEquip))
    // })
    const content = (
        <>
            <p ref={errRef} className={errClass}>{errContent.current}</p>

            <div className="panel panel-default" id="resourceDIV" style={{ fontSize: '14px' }}>
                <div className="panel-heading"><h5>Equipment</h5></div>
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
                            ref={equipGridRef}
                            onCellValueChanged={onValueChanged}
                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                            // onRowDataUpdated={(event) => event.current.api.refreshCells()}
                            defaultColDef={defaultColDef}
                            rowData={rdEquip}
                            columnDefs={equipColDefs}>

                        </AgGridReact>
                    </div>
                </div>
            </div>
        </>
    )

    return content

}

export default FrmEquipForm