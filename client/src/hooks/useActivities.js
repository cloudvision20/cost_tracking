import { useGetActivitiesByProjIdQuery, useGetActivitiesByUserIdQuery } from "../features/activities/activitiesApiSlice"

export const ActvitiesByProj = (projectId) => {
    const { data: activities, isSuccess } = useGetActivitiesByProjIdQuery(projectId)
    if (isSuccess) {
        return { activities, isSuccess }
    }

}

export const ActvitiesByUser = (userid) => {

    const { data: activities, isSuccess } = useGetActivitiesByUserIdQuery(userid);
    if (isSuccess) {
        return { activities, isSuccess }
    }

    // return { activities: [], isSuccess: false }
}
