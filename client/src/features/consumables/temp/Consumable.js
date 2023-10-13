import { useState, useEffect, useMemo, memo, useRef, Component } from "react"
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'
import { useGetConsumablesQuery } from '../consumablesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPlusSquare } from "@fortawesome/free-solid-svg-icons"

let rowId = 0
let eConsumables = {}

const EditConsumableForm = () => {
    const {
        data: consumables,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetConsumablesQuery('consumablesList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const navigate = useNavigate()
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
            width: 150,
        };
    }, []);
    const consumableGridRef = useRef();
    const newData = { "type": "", "name": 0, "capacity": 0, "_id": "" }
    const data = Array.from(consumables).map((data, index) => ({
        "type": data.type,
        "name": data.name,
        "capacity": data.capacity,
        "_id": data._id
    }))
    const [rdConsumable, setRdConsumable] = useState([data])
    const [consumableColDefs, setConsumableColDefs] = useState([
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
                    this.api.applyTransaction({ remove: [this.data] });
                },
                Id: "consumable"
            },
        }
    ])

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const onSaveConsumablesClicked = async (e) => {

        e.preventDefault()
        if (canSave) {
            eConsumables = rdConsumable
            console.log(eConsumables)
            console.log(JSON.stringify(eConsumables))
            await addNewActivity(eConsumables)
        }
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <div className="panel panel-default" id="resourceDIV" style={{ display: "none" }}>
                <div className="panel-heading">Consumables</div>
                <div className="form-group  dash-header__nav">
                    <button
                        className="btn btn-primary"
                        title="New Resources"
                        onClick={onNewClicked}
                    >
                        New
                        <FontAwesomeIcon icon={faPlusSquare} />
                    </button>
                    <button
                        className="btn btn-primary"
                        title="Save"
                        onClick={onSaveClicked}
                        disabled={!canSave}
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </div>
                <div className="panel-body">
                    <div className="ag-theme-alpine" style={{ height: 200, width: "100%" }}>
                        <AgGridReact
                            ref={consumableGridRef}
                            onCellValueChanged={onValueChanged}
                            onGridReady={(event) => event.api.sizeColumnsToFit()}
                            defaultColDef={defaultColDef}
                            rowData={rdConsumable}
                            columnDefs={consumableColDefs}>
                        </AgGridReact>
                    </div>
                </div>
            </div>
        </>
    )

    return content

}

export default EditConsumableForm