import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useGetActivitiesQuery } from './activitiesApiSlice'
import { memo } from 'react'

const Resource = ({ resource, activity_Id, handleOnChanged }) => {

    // const { resource } = useGetActivitiesQuery("activitiesList", {
    //     selectFromResult: ({ data }) => ({
    //         resource: data?.entities[resource]
    //     }),
    // })



    const navigate = useNavigate()

    const [activity_id, setActivity_id] = useState(activity_Id)
    const [_id, set_id] = useState(resource._id)
    const [type, setType] = useState(resource.type)
    const [details, setDetails] = useState(resource.details)
    const [job, setJob] = useState(resource.job)
    const [costType, setCostType] = useState(resource.costType)
    const [uom, setUom] = useState(resource.uom)
    const [rate, setRate] = useState(resource.rate)
    const [qtyAssign, setQtyAssign] = useState(resource.qtyAssign)
    const [remarks, setRemarks] = useState(resource.remarks)

    useEffect(() => {
        console.log(details)
    }, [details])

    if (resource) {
        const created = new Date(resource.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(resource.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })




        const onTypeChanged = (e) => { setType(e.target.value) }
        const onDetailsChanged = (e) => { setDetails(e.target.value) }
        const onJobChanged = (e) => { setJob(e.target.value) }
        const onCostTypeChanged = (e) => { setCostType(e.target.value) }
        const onUomChanged = (e) => { setUom(e.target.value) }
        const onRateChanged = (e) => { setRate(e.target.value) }
        const onQtyAssignChanged = (e) => { setQtyAssign(e.target.value) }
        const onRemarksChanged = (e) => { setRemarks(e.target.value) }
        //const handleEdit = () => navigate(`/dash/activities/${resource}`)



        const handleSave = (e) => { console.log("save") }
        const handleEdit = (e) => {
            //console.log(`parentNode.id = ${document.getElementById(e.currentTarget.resource_id).innerHTML}`)
            console.log(JSON.stringify(resource))
            e.currentTarget.parentNode.parentNode.innerHTML = `<td class=''><input type='text' class='td-input' id='type' onchange='${onTypeChanged}' value='` + resource.type + `'/></td>
            <td class=''><input type='text' class='td-input'  id='details' onchange='${onDetailsChanged}' value='` + resource.details + `'/></td>
            <td class=''><input type='text' class='td-input'  id='job' onchange='${onJobChanged}' value='` + resource.job + `'/></td>
            <td class=''><input type='text' class='td-input'  id='costType' onchange='${onCostTypeChanged}' value='` + resource.costType + `'/></td>
            <td class=''><input type='text' class='td-input'  id='uom' onchange='${onUomChanged}' value='` + resource.uom + `'/></td>
            <td class=''><input type='text' class='td-input'  id='rate' onchange='${onRateChanged}' value='` + resource.rate + `'/></td>
            <td class=''><input type='text' class='td-input'  id='qtyAssign' onchange='${onQtyAssignChanged}' value='` + resource.qtyAssign + `'/></td>
            <td class=''><input type='text' class='td-input'  id='remarks' onchange='${onRemarksChanged}' value='` + resource.remarks + `'/></td>
            <td class=''><button class='btn btn-primary' onClick='${handleSave}' resource_id={resource._id}>${<FontAwesomeIcon icon={faSave} />}</button></td>`
        }
        return (
            <tr id={resource._id} className="">
                <td className="" ><input type="text" class="td-input" id="type" onchange={onTypeChanged} value={resource.type} /></td>
                <td className="">{resource.details}</td>
                <td className="">{resource.job}</td>
                <td className="">{resource.costType}</td>
                <td className="">{resource.uom}</td>
                <td className="">{resource.rate}</td>
                <td className="">{resource.qtyAssign}</td>
                <td className="">{resource.remarks}</td>
                <td className="">
                    <button
                        className="btn btn-primary"
                        onClick={handleEdit}
                        resource_id={resource._id}
                    >

                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedResource = memo(Resource)

export default memoizedResource