import SiteFooterForm from './SiteFooterForm'
import useAuth from "../../hooks/useAuth"
import { useSelector } from 'react-redux'
import { selectActivity } from './siteSlice'

const SiteFooter = () => {

  const activities = useSelector(selectActivity)
  const { userid, username, employeename, status } = useAuth()
  let content

  if (activities) {
    content = <SiteFooterForm userid={userid} username={username} employeename={employeename} status={status} activities={activities} />
  }


  return content
}
export default SiteFooter