import EditDailyReportForm from './EditDailyReportForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useTitle from '../../hooks/useTitle'

const NewDailyReport = () => {
    useTitle('Cost Tracking: New DailyReport')
    const res = {}
    // const { username, isManager, isAdmin } = useAuth()
    const dailyReport = [{
        "_id": "new",
        // "activityId": "",
        "userId": "",
        "title": "",
        "text": "",
        "reportDate": "",
        "reportDay": "",
        "manHour": {
            "indirectPrev": null,
            "indirectTdy": null,
            "indirectCumm": null,
            "directPrev": null,
            "directTdy": null,
            "directCumm": null,
            "loading": [
                {
                    "indirect": null,
                    "indirectPax": null,
                    "direct": null,
                    "directPax": null,
                    "direct1": null,
                    "directPax1": null,
                    "owner": null,
                    "ownerPax": null,
                }
            ],
            "indirectTtl": null,
            "directTtl": null,
            "directTtl1": null,
            "ownerTtl": null,
            "pcSarawakians": null,
            "pcNonSarawakians": null
        },
        "weatherChart": {
            "raining": "",
            "driziling": "",
            "sunny": ""
        },
        "meLoading": [
            {
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
            }
        ],
        "meLoadingTtl": "",
        "safetyTbItem": "",
        "safetyTbDesp": "",
        "downTimeItem": "",
        "downTimeDesp": "",
        "conProgressItem": "",
        "conProgressDesp": "",
        "conProgressStatus": "",
        "nextDayWPItem": "",
        "nextDayWPDesp": "",
        "nextDayWPRemarks": "",
        "prjMaterialItem": "",
        "prjMaterialDocNo": "",
        "prjMaterialQty": "",
        "prjMaterialStatus": "",
        "aocItem": "",
        "aocDesp": "",
        "aocRemedialPlan": "",
        "aocStatus": "",
        "aocDtResolved": "",
        "siteTechQItem": "",
        "siteTechQIDesp": "",
        "siteTechQIDtRaised": "",
        "siteTechQIDtResolved": "",
        "preparedBy": "",
        "verifiedBy": "",
        "acknowledgedBy": "",
        "completed": false,
        "username": ""
    }]
    // const { dailyReport } = useGetDailyReportsQuery("dailyReportsList", {
    //     selectFromResult: ({ data }) => ({
    //         dailyReport: data?.entities[id]
    //     }),
    // })
    let content

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })
    // if (isSuccess) {
    res.dailyReport = dailyReport
    if (users) {
        res.users = users
        content = <EditDailyReportForm res={res} />
    }
    // }
    return content

}
export default NewDailyReport