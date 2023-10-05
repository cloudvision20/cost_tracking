import { useGetActivitiesByUserIdQuery } from '../features/activities/activitiesApiSlice'

const useActvitiesByUser = (userid) => {

    const { data: res, isSuccess } = useGetActivitiesByUserIdQuery(userid);

    return { activities: res, isSuccess }
}
export default useActvitiesByUser