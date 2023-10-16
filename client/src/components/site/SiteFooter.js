import SiteFooterForm from './SiteFooterForm'
import useAuth from "../../hooks/useAuth"
import { useSelector } from 'react-redux'
import { selectActivity } from './siteSlice'

const SiteFooter = () => {

  const activities = useSelector(selectActivity)
  const { userid, username, status } = useAuth()
  let content

  if (activities) {
    content = <SiteFooterForm userid={userid} username={username} status={status} activities={activities[0]} />
  }


  return content
}
export default SiteFooter