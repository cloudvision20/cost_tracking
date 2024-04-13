import { useState, useEffect, useMemo, useRef, Component } from "react"
import { Form } from 'react-bootstrap';
import { useGetRecordsOptionsQuery } from './recordsApiSlice'
import { dateFromDateString, dateForPicker, dateForPickerDMY } from "../../hooks/useDatePicker"
import FrmRecordsConsumable from './FrmRecordsAllConsumable'
import FrmRecordsEquipment from './FrmRecordsAllEquipment'
import FrmRecordsExpense from './FrmRecordsAllExpense'

const FrmRecords = ({ formType }) => {

    let params = {}
    params.formType = formType
    params.projectId = ''
    params.activityId = ''
    params.fDate = '07-07-2023'
    params.tDate = '07-11-2024'

    const activitySelectRef = useRef()
    // const projectOptions 
    const [fDate, setFDate] = useState(params.fDate)
    const [tDate, setTDate] = useState(params.tDate)
    const [fromDate, setFromDate] = useState(new Date(fDate))
    const [toDate, setToDate] = useState(new Date(tDate))
    const [projectId, setProjectId] = useState('')

    const onFromDateChanged = (e) => {
        setFromDate(dateFromDateString(e.target.value))
        params.fDate = dateForPickerDMY(e.target.value)
        setFDate(params.fDate)
    }
    const onToDateChanged = (e) => {
        setToDate(dateFromDateString(e.target.value))
        params.tDate = dateForPickerDMY(e.target.value)
        setTDate(params.tDate)
    }
    const onProjectIdChanged = (e) => {
        console.log(e.target.value)
        setProjectId(e.target.value)
        // activitySelectRef
    }
    const { data: res, isSuccess, isError, error } = useGetRecordsOptionsQuery();

    if (isSuccess) {
        let projOptions
        let actOptions = []
        if (res.projects) {

            projOptions = res.projects?.map((project, idx) => {



                actOptions[project._id] = project?.activities?.map(activity => {
                    return (
                        <option
                            key={activity._id}
                            value={activity._id}
                            projectId={activity.projectId}
                        > {activity.name}</option >
                    )
                })
                return (
                    <option
                        key={project._id}
                        value={project._id}
                    > {project.title}</option >
                )


            })


        }
        else {
            projOptions = <option
                key={''}
                value={''}
            > {''}</option >
            actOptions = <option
                key={''}
                value={''}
            > {''}</option >
        }

        const header = (
            <>
                <div>
                    <span style={{ fontSize: '15px' }}> <b>filter options</b></span>
                    <div className="container grid_system" style={{ fontSize: '12px', paddingRight: '25px', borderTop: "1px solid gray", borderLeft: "1px solid gray", borderBottom: "1px solid gray", borderRight: "1px solid gray" }}>
                        <div className="form-group row" >
                            <div className="col-sm-1" style={{ border: "0px" }}><b>Project: </b></div>
                            <div className="col-sm-1" style={{ border: "0px" }}>
                                <select
                                    id="project" name="project"
                                    style={{ fontSize: '11px' }}
                                    className="form-select form-select-sm"
                                    value={projectId}
                                    onChange={onProjectIdChanged}
                                >
                                    {projOptions}
                                </select>
                            </div>
                            <div className="col-sm-1" style={{ border: "0px" }}><b>Activity: </b></div>
                            <div className="col-sm-1" style={{ border: "0px" }}>
                                <select
                                    ref={activitySelectRef}
                                    id="activity" name="activity"
                                    style={{ fontSize: '11px' }}
                                    className="form-select form-select-sm"
                                // value={unit}
                                // onChange={onDetailsChanged}
                                >
                                    {actOptions}
                                </select>
                            </div>
                            <div className="col-sm-1" style={{ border: "0px" }}><b>FormType: </b></div>
                            <div className="col-sm-1" style={{ border: "0px" }}>
                                <select
                                    id="formType" name="formType"
                                    style={{ fontSize: '11px' }}
                                    className="form-select form-select-sm"
                                // value={unit}
                                // onChange={onDetailsChanged}
                                >
                                    {/* {frmOptions} */}
                                </select>
                            </div>
                            <div className="col-sm-1" style={{ border: "0px" }}><b>Date range: </b></div>
                            <div className="col-sm-1" style={{ border: "0px" }}>
                                <Form.Group controlId="fromDate">
                                    <Form.Control
                                        type="date"
                                        style={{ fontSize: '11px' }}
                                        value={fromDate ? dateForPicker(fromDate) : ''}
                                        placeholder={fromDate ? dateForPicker(fromDate) : "dd-mm-yyyy"}
                                        onChange={onFromDateChanged}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-sm-1" style={{ border: "0px" }}>
                                <Form.Group controlId="toDate">
                                    <Form.Control
                                        type="date"
                                        style={{ fontSize: '11px' }}
                                        value={toDate ? dateForPicker(toDate) : ''}
                                        placeholder={toDate ? dateForPicker(toDate) : "dd-mm-yyyy"}
                                        onChange={onToDateChanged}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )

        const content = (
            <>
                <div>
                    <span style={{ fontSize: '20px' }}> <b>Content</b></span>
                </div>
            </>
        )
        const form_Type = (

            (formType === 'Consumables') ?
                <FrmRecordsConsumable formType={formType} params={params} />
                : (formType === 'Equipment') ?
                    <FrmRecordsEquipment formType={formType} params={params} />
                    : (formType === 'Expenses') ?
                        <FrmRecordsExpense formType={formType} params={params} />
                        : null


        )
        return (
            <>
                <div className="container grid_system" style={{ fontSize: '12px', paddingLeft: '25px', paddingRight: '25px', borderTop: "1px solid blue", borderLeft: "1px solid blue", borderBottom: "1px solid blue", borderRight: "1px solid blue" }}>
                    {/* <div className="form-group row" >                    {header}                </div>
                <div className="form-group row" >                    {content}                </div>
                <div className="form-group row" >                    {form_Type}                </div> */}

                    {header}
                    {content}
                    {form_Type}
                </div>
            </>

        )
    }


}
export default FrmRecords