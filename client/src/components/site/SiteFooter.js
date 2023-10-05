import SiteFooterForm from './SiteFooterForm'
//import { useGetActivitiesByUserIdQuery } from './../../features/activities/activitiesApiSlice'
import useAuth from "../../hooks/useAuth"
import useActvitiesByUser from '../../hooks/useActvitiesByUser'

const SiteFooter = () => {

  // const { id } = useParams()


  const { userid, username, status } = useAuth()
  //const { data: res, isSuccess } = useGetActivitiesByUserIdQuery(userid);
  const { activities, isSuccess } = useActvitiesByUser(userid)
  let content

  if (isSuccess) {

    content = <SiteFooterForm userid={userid} username={username} status={status} activities={activities[0]} />

  }


  return content
}
export default SiteFooter