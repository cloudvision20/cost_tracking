import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let isSite = false
    let isHQ = false
    let location = "HQ"
    let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token)
        const { currActivityId, userid, username, roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isSite = roles.includes('Site')
        isHQ = roles.includes('HQ')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"
        if (isSite) location = "Site"
        if (isHQ) location = "HQ"
        return { currActivityId, userid, username, roles, status, location, isManager, isAdmin }
    }

    return { currActivityId: '', userid: '', username: '', roles: [], isManager, isAdmin, status, location }
}
export default useAuth