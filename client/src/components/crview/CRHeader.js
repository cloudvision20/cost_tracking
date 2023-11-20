import CRHeaderForm from './CRHeaderForm'
import useTitle from "../../hooks/useTitle"
import useAuth from "../../hooks/useAuth"
import { useSelector } from 'react-redux'
import { selectActivity } from './crSlice'

const CRHeader = () => {
  useTitle('CR Page')
  const activities = useSelector(selectActivity)
  const { userid, username, status, isManager, isAdmin } = useAuth()

  let content
  if (activities) {
    content = <CRHeaderForm isManager={isManager} isAdmin={isAdmin} userid={userid} username={username} status={status} activities={activities[0]} />
  }


  return content
}
export default CRHeader