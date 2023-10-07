import { useGetActivitiesByUserIdQuery } from '../features/activities/activitiesApiSlice'

const useActvitiesByUser = (userid) => {

    const { data: res, isSuccess } = useGetActivitiesByUserIdQuery(userid);
    // if (isSuccess) {
    return { activities: res, isSuccess }
    // }

    // return { activities: [], isSuccess: false }
}
export default useActvitiesByUser