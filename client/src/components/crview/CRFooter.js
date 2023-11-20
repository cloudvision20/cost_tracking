import CRFooterForm from './CRFooterForm'
import useAuth from "../../hooks/useAuth"
import { useSelector } from 'react-redux'
import { selectActivity } from './crSlice'

const CRFooter = () => {

  const activities = useSelector(selectActivity)
  const { userid, username, status } = useAuth()
  let content

  if (activities) {
    content = <CRFooterForm userid={userid} username={username} status={status} activities={activities} />
  }


  return content
}
export default CRFooter